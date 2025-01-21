import { IProperty, IPropertyMap } from "./0.common";

const generatePropertyDefinition = (key: string, property: IProperty) => {
  const dataTypeMap: Record<string, string> = {
    string: "DataTypes.STRING",
    number: "DataTypes.INTEGER",
    boolean: "DataTypes.BOOLEAN",
    object: "DataTypes.JSON",
    array: "DataTypes.ARRAY(DataTypes.STRING)",
  };

  const type: keyof typeof dataTypeMap = Array.isArray(property.value)
    ? "array"
    : typeof property.value === "object" && property.value !== null
    ? "object"
    : typeof property.value;

  const normalValue = `{
    type: ${dataTypeMap[type] || "DataTypes.STRING"},
    allowNull: ${property.type === "required" ? "false" : "true"},
  }`;

  const primaryValue = `{
    type: ${dataTypeMap[type] || "DataTypes.STRING"},
    allowNull: false,
    autoIncrement: true,
    primaryKey: true, 
  }`;

  return `
        ${key}: ${key == "Id" ? primaryValue : normalValue},`;
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
          propertyMap.properties[key].type === "optional" ? "?" : "!"
        }: ${typeof propertyMap.properties[key].value};`
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
