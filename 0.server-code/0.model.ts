import { IProperty, IPropertyMap } from "../app.common";

export function createModelFromObjectMap(propertyMap: IPropertyMap): string {
  const { name, properties } = propertyMap;

  let interfaceString = `export interface I${name} {\n`;

  for (const [key, property] of Object.entries(properties)) {
    const optionalFlag = property.isOptional ? "?" : "";
    let valueType = getTypeScriptType(property);

    interfaceString += `  ${key}${optionalFlag}: ${valueType};\n`;
  }

  interfaceString += `}`;
  return interfaceString;
}

// Helper function to map IProperty to TypeScript types
const getTypeScriptType = (property: IProperty): string => {
  const { propType, isArray, validation } = property;

  switch (propType) {
    case "string":
      return isArray ? "string[]" : "string";
    case "number":
      return isArray ? "number[]" : "number";
    case "boolean":
      return isArray ? "boolean[]" : "boolean";
    case "object":
      return isArray ? "Record<string, any>[]" : "Record<string, any>";
    case "enum":
      if (validation && "values" in validation) {
        const enumValues = validation.values.map((v) =>
          typeof v === "string" ? `"${v}"` : v
        );
        return isArray
          ? `(${enumValues.join(" | ")})[]`
          : enumValues.join(" | ");
      }
      return "any"; // Default to any if no enum values are provided
    default:
      return isArray ? "any[]" : "any";
  }
};
