export type PropertyType = "required" | "optional";

export interface IProperty {
  value: string | number | boolean | object | null; // Extendable for more types
  type: PropertyType;
}

export interface IPropertyMap {
  name: string; // Name of the interface
  properties: { [key: string]: IProperty }; // Properties of the interface
}
