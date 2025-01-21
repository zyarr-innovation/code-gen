import { IProperty, IPropertyMap } from "./0.common";

export function createModelFromObjectMap(propertyMap: IPropertyMap): string {
  const { name, properties } = propertyMap;

  let interfaceString = `export interface I${name} {\n`;

  for (const [key, { value, type }] of Object.entries(properties)) {
    const optionalFlag = type === "optional" ? "?" : "";
    let valueType: string;

    // Determine the TypeScript type
    if (value === null) {
      valueType = "any"; // Null is considered any
    } else if (Array.isArray(value)) {
      valueType = "any[]"; // Arrays are typed as any[]
    } else {
      valueType = typeof value;
    }

    interfaceString += `  ${key}${optionalFlag}: ${valueType};\n`;
  }

  interfaceString += `}`;
  return interfaceString;
}
