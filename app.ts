import { IPropertyMap } from "./app.common";
import { generateServerCode } from "./server-code/100.generateCode";

const propertyMap: IPropertyMap = {
  name: "Teacher",
  properties: {
    Id: {
      value: 123,
      isOptional: false,
      propType: "number",
      validation: { min: 1, max: 9999 },
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
      value: "ABC High School",
      isOptional: false,
      propType: "string",
      validation: { minLength: 3, maxLength: 255 },
    },
    isActive: {
      value: true,
      isOptional: true,
      propType: "boolean",
    },
    grades: {
      value: [10, 12],
      isOptional: true,
      propType: "number",
      isArray: true,
      validation: { min: 1, max: 12 },
    },
    role: {
      value: "teacher",
      isOptional: false,
      propType: "enum",
      validation: { values: ["teacher", "assistant", "principal"] },
    },
    metadata: {
      value: { principal: "Dr. Smith", founded: 1990 },
      isOptional: true,
      propType: "object",
      nestedMap: {
        name: "SchoolMetadata",
        properties: {
          principal: {
            value: "Dr. Smith",
            isOptional: false,
            propType: "string",
            validation: { minLength: 3, maxLength: 100 },
          },
          founded: {
            value: 1990,
            isOptional: true,
            propType: "number",
            validation: { min: 1900, max: 2100 },
          },
        },
      },
    },
  },
};

generateServerCode(propertyMap);
