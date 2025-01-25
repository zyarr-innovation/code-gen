import { capitalizeFirstLetter, IProperty, IPropertyMap } from "../app.common";

export function createServiceModelFromObjectMap(
  propertyMap: IPropertyMap
): string {
  const interfaceName = `IService${propertyMap.name}`;
  const modelImport = `I${propertyMap.name}`;

  let getAllParam = "";
  let isForeignKeyPresent = false;
  Object.entries(propertyMap.properties).forEach(([key, definition]) => {
    if (definition.isForeign) {
      getAllParam += `in${capitalizeFirstLetter(key)}Id: number, `;
      isForeignKeyPresent = true;
    }
  });
  getAllParam = getAllParam.trim().replace(/,\s*$/, "");

  const serviceInterfaceCode = `
  import { ${modelImport} } from "./0.model";

  export interface ${interfaceName} {
    getAll(${
      isForeignKeyPresent ? getAllParam : ""
    }): Promise<${modelImport}[] | null>;
    get(in${propertyMap.name}Id: number): Promise<${modelImport} | null>;
    create(in${
      propertyMap.name
    }Info: ${modelImport}): Promise<${modelImport} | null>;
    update(in${propertyMap.name}Id: number, in${
    propertyMap.name
  }Info: ${modelImport}): Promise<number>;
    delete(in${propertyMap.name}Id: number): Promise<number>;
  }
  `;

  return serviceInterfaceCode;
}
