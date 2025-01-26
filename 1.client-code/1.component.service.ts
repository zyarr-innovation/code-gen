import {
  IProperty,
  IPropertyMap,
  EnumValidation,
  capitalizeFirstLetter,
} from "../app.common";
export function createServiceCode(
  propertyMap: IPropertyMap,
  relation: { [key: string]: string[] }
): string {
  const interfaceName = propertyMap.name;
  const properties = propertyMap.properties;
  const apiUrl = `http://localhost:3000/v1`;
  const className = `${interfaceName}Service`;

  const generateForeignAttributes = (): string => {
    return Object.entries(propertyMap.properties)
      .filter(([key, prop]) => prop.isForeign)
      .map(([key]) => `${key}Id: number = 0; `)
      .join("\n");
  };

  const generateForeignParams = (): string => {
    return Object.entries(propertyMap.properties)
      .filter(([key, prop]) => prop.isForeign)
      .map(([key]) => `in${capitalizeFirstLetter(key)}Id: number`)
      .join(",");
  };

  const generateForeignParamsAssignment = (): string => {
    return Object.entries(propertyMap.properties)
      .filter(([key, prop]) => prop.isForeign)
      .map(([key]) => `this.${key}Id = in${capitalizeFirstLetter(key)}Id;`)
      .join("\n");
  };

  const generateForeignParamsUrl = (): string => {
    return Object.entries(propertyMap.properties)
      .filter(([key, prop]) => prop.isForeign)
      .map(([key]) => `/${key}/\$\{in${capitalizeFirstLetter(key)}Id\}`)
      .join("");
  };

  const processRelationCode = (): string => {
    return Object.entries(relation)
      .filter(([key, value]) => key === propertyMap.name)
      .map(([key, valueList]) =>
        valueList
          .map(
            (eachValue) => `
          get(in${key}Id: number): Observable<IStudent> {
            return this.http.get<IStudent>(\`\${this.apiUrl}/${interfaceName.toLowerCase()}/\${in${interfaceName}Id}\`, {
              headers: this.headers,
            });
          }
          `
          )
          .join("\n")
      )
      .join("\n");
  };

  // Generate the service class
  const generateServiceClass = (): string => {
    return `import { Injectable } from '@angular/core';
  import { Observable } from 'rxjs';
  import { HttpClient, HttpHeaders  } from '@angular/common/http';
  import { I${interfaceName} } from './${interfaceName.toLowerCase()}.model';
  
  @Injectable({
    providedIn: 'root',
  })
  export class ${className} {
    private apiUrl = '${apiUrl}';
    ${generateForeignAttributes()}
    data: I${interfaceName}[] = [];
  
    // Define the headers
    private headers = new HttpHeaders({
      'Content-Type': 'application/json',
      tenantid: 'tenanta',
      traceparent: '12345',
      Authorization: 'Bearer Token', // Replace "Token" with your actual token
    });

    constructor(private http: HttpClient) {}
  
    getAll(${generateForeignParams()}): Observable<I${interfaceName}[]> {
      ${generateForeignParamsAssignment()}
      return this.http.get<I${interfaceName}[]>(\`\${this.apiUrl}/${interfaceName.toLowerCase()}${generateForeignParamsUrl()}\`, {
        headers: this.headers,
      });
    }

    get(in${interfaceName}Id: number): Observable<I${interfaceName}> {
      return this.http.get<I${interfaceName}>(\`\${this.apiUrl}/${interfaceName.toLowerCase()}/\${in${interfaceName}Id}\`, {
        headers: this.headers,
      });
    }
  
    add(in${interfaceName}: I${interfaceName}): Observable<I${interfaceName}> {
      return this.http.post<I${interfaceName}>(
        \`\${this.apiUrl}/${interfaceName.toLowerCase()}\`,
          in${interfaceName}, {
          headers: this.headers,
        }
      );
    }
  
    edit(in${interfaceName}: I${interfaceName}): Observable<I${interfaceName}> {
      return this.http.put<I${interfaceName}>(
        \`\${this.apiUrl}/${interfaceName.toLowerCase()}/\${in${interfaceName}.Id}\`,
          in${interfaceName}, {
          headers: this.headers,
        }
      );
    }
  
    delete(in${interfaceName}Id: number): Observable<void> {
      return this.http.delete<void>(\`\${this.apiUrl}/${interfaceName.toLowerCase()}/\${in${interfaceName}Id}\`, {
          headers: this.headers,
        }
      );
    }
  }`;
  };

  return `${generateServiceClass()}`;
}
