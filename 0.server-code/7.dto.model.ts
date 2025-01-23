import { IProperty, IPropertyMap, PropType } from "../app.common";

const generatePropertyDefinition = (key: string, property: IProperty) => {
  const dataTypeMap: Record<PropType, string> = {
    string: "DataTypes.STRING",
    number: "DataTypes.INTEGER",
    boolean: "DataTypes.BOOLEAN",
    object: "DataTypes.JSON",
    enum: "DataTypes.ENUM",
  };

  const isArray = property.isArray
    ? `DataTypes.ARRAY(${dataTypeMap[property.propType]})`
    : dataTypeMap[property.propType];

  const enumValues =
    property.propType === "enum" && property.validation
      ? (
          property.validation as { values: (string | number | boolean)[] }
        ).values
          .map((v) => `'${v}'`)
          .join(", ")
      : null;

  const fieldType = enumValues ? `DataTypes.ENUM(${enumValues})` : isArray;

  let definition = `{
    type: ${fieldType || "DataTypes.STRING"},
    allowNull: ${property.isOptional ? "true" : "false"},
    ${key === "Id" ? "autoIncrement: true,\n    primaryKey: true," : ""}
  }`;

  if (property.isPrimary) {
    definition = `{
      type : DataTypes.INTEGER,
      allowNull : true,
      autoIncrement : true,
      primaryKey : true,
    }`;
  } else if (property.isForeign) {
    definition = `{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: {
            schema: schemaName,
            tableName: "${key}",
          },
          key: "Id",
        },
      }`;
  }

  return `
        ${key}: ${definition},`;
};

export function createDtoModelFromObjectMap(propertyMap: IPropertyMap): string {
  const dtoClassName = `DTO${propertyMap.name}`;
  const tableName = propertyMap.name.toLowerCase();

  const dtoModelCode = `
  import { Sequelize, Model, DataTypes } from "sequelize";
  import { I${propertyMap.name} } from "./0.model";

  export class ${dtoClassName} extends Model {
  ${Object.keys(propertyMap.properties)
    .map(
      (key) =>
        `  ${key}${
          propertyMap.properties[key].isOptional ? "?" : "!"
        }: ${getTypeScriptType(propertyMap.properties[key])};`
    )
    .join("\n")}
  }

  export const init${dtoClassName}Model = (
    schemaName: string,
    sequelize: Sequelize
  ) => {
    ${dtoClassName}.init(
      {${Object.entries(propertyMap.properties)
        .map(([key, definition]) => generatePropertyDefinition(key, definition))
        .join("")}
      },
      {
        sequelize,
        schema: schemaName,
        tableName: "${tableName}",
        timestamps: false,
      }
    );
  };
  `;

  return dtoModelCode;
}

// Helper function to map PropType to TypeScript types
const getTypeScriptType = (property: IProperty): string => {
  if (property.isArray) {
    return `${mapPropTypeToTsType(property.propType)}[]`;
  }
  return mapPropTypeToTsType(property.propType);
};

const mapPropTypeToTsType = (propType: PropType): string => {
  switch (propType) {
    case "string":
      return "string";
    case "number":
      return "number";
    case "boolean":
      return "boolean";
    case "object":
      return "Record<string, any>";
    case "enum":
      return "string | number | boolean"; // Adjust if enums are stricter
    default:
      return "any";
  }
};
