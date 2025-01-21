import { IProperty, IPropertyMap } from "./0.common";

const mapTypeToZod = (key: string, propertyValue: IProperty) => {
  const baseType = typeof propertyValue.value;
  let zodType;

  switch (baseType) {
    case "string":
      zodType = "z.string()";
      break;
    case "number":
      zodType = "z.number()";
      break;
    case "boolean":
      zodType = "z.boolean()";
      break;
    case "object":
      if (Array.isArray(propertyValue.value)) {
        zodType = `z.array(z.string())`; // Assuming arrays contain strings
      } else if (propertyValue.value === null) {
        zodType = "z.string().nullable()"; // Null represents an unknown or any type
      } else {
        zodType = "z.object({})"; // Simplified for nested objects
      }
      break;
    default:
      zodType = "z.any()"; // Fallback for unrecognized types
  }

  if (propertyValue.type === "optional") {
    zodType += ".optional()";
  }

  return `${key}: ${zodType}`;
};

// Generate zod schema
const generateZodSchema = (propertyMap: IPropertyMap) => {
  const schemaFields = Object.entries(propertyMap.properties)
    .map(([key, value]) => mapTypeToZod(key, value))
    .join(",\n  ");
  return `const ${propertyMap.name.toLowerCase()}Schema = z.object({\n  ${schemaFields}\n});`;
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
