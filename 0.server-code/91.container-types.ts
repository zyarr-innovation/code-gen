import { IProperty, IPropertyMap } from "../app.common";

export function createContainerTypeBase() {
  return `
    const TYPES = {
        LoggerService: Symbol("LoggerService"),

        };
        export default TYPES;
    `;
}

export function createContainerTypesFromObjectMap(
  propertyMap: IPropertyMap
): string {
  const { name, properties } = propertyMap;

  let containerTypeString = `
    Controller${name}: Symbol("Controller${name}"),
    Service${name}: Symbol("Service${name}"),
    Repo${name}: Symbol("Repo${name}"),
  `;

  return containerTypeString;
}
