import { IProperty, IPropertyMap } from "../app.common";

export function createInitModelBase() {
  return `
    import { Sequelize } from "sequelize";
    export async function initModels(schemaName: string, sequelize: Sequelize) {
        
        sequelize.sync();
    }
    `;
}

export function createInitModelsFromObjectMap(
  propertyMap: IPropertyMap
): string {
  const { name, properties } = propertyMap;
  let initModelsString = `
    import { initDTO${name}Model } from "../${name.toLowerCase()}/7.dto.model";
    initDTO${name}Model(schemaName, sequelize);
  `;

  return initModelsString;
}
