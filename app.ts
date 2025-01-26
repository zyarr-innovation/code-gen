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
      value: "Anjuman Khairul Islam",
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
        pattern: "^[A-Za-z0-9'.-, ]+$",
      },
    },
  },
};

const propertyMapStandard: IPropertyMap = {
  name: "Standard",
  properties: {
    Id: {
      value: 0,
      isOptional: true,
      propType: "number",
      validation: { min: 1, max: 9999 },
      isPrimary: true,
    },
    name: {
      value: "5th",
      isOptional: false,
      propType: "string",
      validation: { minLength: 3, maxLength: 255, pattern: "^[A-Za-z ]+$" },
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
    standard: {
      value: 0,
      isOptional: true,
      propType: "number",
      validation: { min: 1, max: 9999 },
      isForeign: true,
    },
  },
};

const propertyMapSubject: IPropertyMap = {
  name: "Subject",
  properties: {
    Id: {
      value: 0,
      isOptional: true,
      propType: "number",
      validation: { min: 1, max: 9999 },
      isPrimary: true,
    },
    name: {
      value: "English",
      isOptional: false,
      propType: "string",
      validation: { minLength: 3, maxLength: 255, pattern: "^[A-Za-z ]+$" },
    },
    standard: {
      value: 0,
      isOptional: true,
      propType: "number",
      validation: { min: 1, max: 9999 },
      isForeign: true,
    },
  },
};

const propertyMapContent: IPropertyMap = {
  name: "Content",
  properties: {
    Id: {
      value: 0,
      isOptional: true,
      propType: "number",
      validation: { min: 1, max: 9999 },
      isPrimary: true,
    },
    Quiz: {
      value: "",
      isOptional: false,
      propType: "string",
      validation: { minLength: 3, maxLength: 2048 },
    },
    FillBlanks: {
      value: "",
      isOptional: false,
      propType: "string",
      validation: { minLength: 3, maxLength: 2048 },
    },
    TrueFalse: {
      value: "",
      isOptional: false,
      propType: "string",
      validation: { minLength: 3, maxLength: 2048 },
    },
    subject: {
      value: 0,
      isOptional: true,
      propType: "number",
      validation: { min: 1, max: 9999 },
      isForeign: true,
    },
  },
};

const relation = {
  School: ["Standard"],
  Standard: ["Student", "Subject"],
  Subject: ["Content"],
};

generateCode(propertyMapSchool, relation);
generateCode(propertyMapStudent, relation);

generateCode(propertyMapStandard, relation);
generateCode(propertyMapSubject, relation);
generateCode(propertyMapContent, relation);
