import { IProperty, IPropertyMap, EnumValidation } from "../app.common";
export function createServiceCode(propertyMap: IPropertyMap): string {
  const interfaceName = propertyMap.name;
  const properties = propertyMap.properties;
  const apiUrl = `data/${interfaceName.toLowerCase()}.json`;
  const className = `${interfaceName}Service`;

  // Generate the service class
  const generateServiceClass = (): string => {
    return `import { Injectable } from '@angular/core';
  import { Observable } from 'rxjs';
  import { HttpClient } from '@angular/common/http';
  import { I${interfaceName} } from './${interfaceName.toLowerCase()}.model';
  
  @Injectable({
    providedIn: 'root',
  })
  export class ${className} {
    private apiUrl = '${apiUrl}';
    data: I${interfaceName}[] = [];
  
    constructor(private http: HttpClient) {}
  
    get(): Observable<I${interfaceName}[]> {
      return this.http.get<I${interfaceName}[]>(this.apiUrl);
    }
  
    add(${interfaceName.toLowerCase()}: I${interfaceName}): Observable<I${interfaceName}> {
      return this.http.post<I${interfaceName}>(
        \`\${this.apiUrl}/${interfaceName.toLowerCase()}s\`,
        ${interfaceName.toLowerCase()}
      );
    }
  
    edit(${interfaceName.toLowerCase()}: I${interfaceName}): Observable<I${interfaceName}> {
      return this.http.put<I${interfaceName}>(
        \`\${this.apiUrl}/${interfaceName.toLowerCase()}s/\${${interfaceName.toLowerCase()}.Id}\`,
        ${interfaceName.toLowerCase()}
      );
    }
  
    delete(${interfaceName.toLowerCase()}Id: number): Observable<void> {
      return this.http.delete<void>(\`\${this.apiUrl}/${interfaceName.toLowerCase()}s/\${${interfaceName.toLowerCase()}Id}\`);
    }
  }`;
  };

  return `${generateServiceClass()}`;
}
