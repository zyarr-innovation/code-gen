import {
  EnumValidation,
  IProperty,
  IPropertyMap,
  NumberValidation,
  StringValidation,
} from "../app.common";

const mapTypeToZod = (key: string, propertyValue: IProperty) => {
  let zodType: string;

  // Map propType to Zod type
  switch (propertyValue.propType) {
    case "string":
      zodType = "z.string()";
      let validatorStr = propertyValue.validation as StringValidation;
      if (validatorStr?.minLength) {
        zodType += `.min(${validatorStr.minLength})`;
      }
      if (validatorStr?.maxLength) {
        zodType += `.max(${validatorStr.maxLength})`;
      }
      if (validatorStr?.pattern) {
        zodType += `.regex(/${validatorStr.pattern}/)`;
      }
      break;
    case "number":
      zodType = "z.number()";
      let validatorNum = propertyValue.validation as NumberValidation;
      if (validatorNum?.min) {
        zodType += `.min(${validatorNum.min})`;
      }
      if (validatorNum?.max) {
        zodType += `.max(${validatorNum.max})`;
      }
      break;
    case "boolean":
      zodType = "z.boolean()";
      break;
    case "enum":
      let validatorEnum = propertyValue.validation as EnumValidation;
      zodType = `z.enum([${validatorEnum?.values
        ?.map((v) => `"${v}"`)
        .join(", ")}])`;
      break;
    case "object":
      if (propertyValue.nestedMap) {
        zodType = `z.lazy(() => ${propertyValue.nestedMap.name.toLowerCase()}Schema)`;
      } else {
        zodType = "z.object({})"; // Generic object type
      }
      break;
    default:
      zodType = "z.any()"; // Fallback for unrecognized types
  }

  // Handle arrays
  if (propertyValue.isArray) {
    zodType = `z.array(${zodType})`;
  }

  // Handle optional properties
  if (propertyValue.isOptional) {
    zodType += ".nullable().optional()";
  }

  return `${key}: ${zodType}`;
};

// Generate Zod schema
const generateZodSchema = (propertyMap: IPropertyMap): string => {
  const nestedSchemas = Object.values(propertyMap.properties)
    .filter((property) => property.nestedMap)
    .map((property) => generateZodSchema(property.nestedMap!))
    .join("\n\n");

  const schemaFields = Object.entries(propertyMap.properties)
    .map(([key, value]) => mapTypeToZod(key, value))
    .join(",\n  ");

  const schemaName = `${propertyMap.name.toLowerCase()}Schema`;

  const schema = `const ${schemaName} = z.object({\n  ${schemaFields}\n});`;

  return nestedSchemas ? `${nestedSchemas}\n\n${schema}` : schema;
};

export function createValidatorFromObjectMap(
  propertyMap: IPropertyMap
): string {
  const schemaCode = generateZodSchema(propertyMap);
  const fileContent = `import { Request, Response, NextFunction } from "express";
  import { z } from "zod";
  import { handleValidationError } from "../common/validation-error";

  ${schemaCode}

  const validate${propertyMap.name} = (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      // Validate request body against schema
      ${propertyMap.name.toLowerCase()}Schema.parse(request.body);
      next();
    } catch (error) {
      // Use the common error handler
      handleValidationError(error, response, next);
    }
  };

  export { validate${propertyMap.name} };
  `;

  return fileContent;
}
