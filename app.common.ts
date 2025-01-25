export type PropType = "string" | "number" | "boolean" | "object" | "enum";

export interface StringValidation {
  minLength?: number;
  maxLength?: number;
  pattern?: string;
}

export interface NumberValidation {
  min?: number;
  max?: number;
}

export interface EnumValidation {
  values: (string | number | boolean)[]; // Possible values for the enum
}

export interface IProperty {
  value: string | number | boolean | object | null; // Default value
  isOptional: boolean; // Indicates if the property is optional
  propType: PropType; // Specifies the type of the property
  isArray?: boolean; // Flag for arrays
  validation?: StringValidation | NumberValidation | EnumValidation; // Validation rules
  isPrimary?: boolean;
  isForeign?: boolean;
}

export interface IPropertyMap {
  name: string; // Name of the interface
  properties: { [key: string]: IProperty }; // Properties of the interface
}

export function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
