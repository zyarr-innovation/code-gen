import { IProperty, IPropertyMap, EnumValidation } from "../app.common";
export function createServiceCode(propertyMap: IPropertyMap): string {
  const interfaceName = propertyMap.name;
  const properties = propertyMap.properties;
  const apiUrl = `http://localhost:3000/v1`;
  const className = `${interfaceName}Service`;

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
    data: I${interfaceName}[] = [];
  
    // Define the headers
    private headers = new HttpHeaders({
      'Content-Type': 'application/json',
      tenantid: 'tenanta',
      traceparent: '12345',
      Authorization: 'Bearer Token', // Replace "Token" with your actual token
    });

    constructor(private http: HttpClient) {}
  
    getAll(): Observable<I${interfaceName}[]> {
      return this.http.get<I${interfaceName}[]>(\`\${this.apiUrl}/${interfaceName.toLowerCase()}\`, {
        headers: this.headers,
      });
    }

    get(in${interfaceName}Id: number): Observable<IStudent> {
    return this.http.get<IStudent>(\`\${this.apiUrl}/${interfaceName.toLowerCase()}/\${in${interfaceName}Id}\`, {
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
