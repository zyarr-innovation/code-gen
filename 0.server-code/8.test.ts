import { IProperty, IPropertyMap } from "../app.common";

export function generateRestClientCode(propertyMap: IPropertyMap) {
  const entityName = propertyMap.name.toLowerCase();
  const baseUrl = `{{baseUrl}}/v1/${entityName}`;

  const postPayload = Object.keys(propertyMap.properties)
    .filter((key) => propertyMap.properties[key].isOptional === false)
    .reduce((acc, key) => {
      acc[key] = propertyMap.properties[key].value;
      return acc;
    }, {} as Record<string, any>);

  const putPayload = Object.keys(propertyMap.properties).reduce((acc, key) => {
    acc[key] = key === "Id" ? 5 : `${propertyMap.properties[key].value}0`;
    return acc;
  }, {} as Record<string, any>);

  return `
  @baseUrl = http://localhost:3000

  ####
GET ${baseUrl}
Content-Type: application/json
tenantid: tenanta
traceparent: 12345
Authorization: bearer Token

 ####
  # @name Create${propertyMap.name}

POST ${baseUrl}
Content-Type: application/json
tenantid: tenanta
traceparent: 12345
Authorization: bearer Token

${JSON.stringify(
  {
    ...postPayload,
  },
  null,
  2
)}

### Capture Id from Response
@studentId = {{Create${propertyMap.name}.response.body.Id}}

####
GET ${baseUrl}/{{studentId}}
Content-Type: application/json
tenantid: tenanta
traceparent: 12345
Authorization: bearer Token

####
PUT ${baseUrl}/{{studentId}}
Content-Type: application/json
tenantid: tenanta
traceparent: 12345
Authorization: bearer Token

${JSON.stringify(
  {
    ...putPayload,
  },
  null,
  2
)}

####
DELETE ${baseUrl}/{{studentId}}
Content-Type: application/json
tenantid: tenanta
traceparent: 12345
Authorization: bearer Token
`;
}
