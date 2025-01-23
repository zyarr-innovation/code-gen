import { IPropertyMap } from "./app.common";
import { generateCode } from "./app.helper";

const propertyMapSchool: IPropertyMap = {
  name: "School",
  properties: {
    Id: {
      value: 123,
      isOptional: true,
      propType: "number",
      validation: { min: 1, max: 9999 },
      isPrimary: true,
    },
    name: {
      value: "John Doe",
      isOptional: false,
      propType: "string",
      validation: { minLength: 3, maxLength: 255, pattern: "^[A-Za-z ]+$" },
    },
    address: {
      value: "Agripada, Mumbai",
      isOptional: false,
      propType: "string",
      validation: {
        minLength: 16,
        maxLength: 255,
        pattern: "^[0-9A-Za-z-,.\\ ]+$",
      },
    },
  },
};

const propertyMapStudent: IPropertyMap = {
  name: "Student",
  properties: {
    Id: {
      value: 123,
      isOptional: true,
      propType: "number",
      validation: { min: 1, max: 9999 },
      isPrimary: true,
    },
    name: {
      value: "John Doe",
      isOptional: false,
      propType: "string",
      validation: { minLength: 3, maxLength: 255, pattern: "^[A-Za-z ]+$" },
    },
    adhaar: {
      value: "1234-5678-9012",
      isOptional: false,
      propType: "string",
      validation: { pattern: "^[0-9]{4}-[0-9]{4}-[0-9]{4}$" },
    },
    school: {
      value: 0,
      isOptional: true,
      propType: "number",
      validation: { min: 1, max: 9999 },
      isForeign: true,
    },
  },
};

generateCode(propertyMapSchool);
generateCode(propertyMapStudent);
