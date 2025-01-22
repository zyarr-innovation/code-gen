import fs, { stat } from "fs";
import path from "path";

import { IProperty, IPropertyMap } from "../app.common";

import { createModelFromObjectMap } from "./0.component.model";
import { createServiceCode } from "./1.component.service";
import { createComponentCode } from "./2.component.code";
import { createComponentHTML } from "./3.component.html";
import { createComponentCSS } from "./4.component.css";

function createFile(filePath: string, codeImpl: string) {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
  fs.writeFileSync(filePath, codeImpl);
}
export function generateClientCode(
  targetFolder: string,
  propertyMap: IPropertyMap
) {
  if (!fs.existsSync(targetFolder)) {
    fs.mkdirSync(targetFolder, { recursive: true });
  }

  let objectName = propertyMap.name.toLowerCase();

  const generatedModel = createModelFromObjectMap(propertyMap);
  const modelFilePath = `${targetFolder}/${objectName}.model.ts`;
  createFile(modelFilePath, generatedModel);

  const generatedValidator = createServiceCode(propertyMap);
  const validatorFileName = `${targetFolder}/${objectName}.service.ts`;
  createFile(validatorFileName, generatedValidator);

  const generatedController = createComponentCode(propertyMap);
  const controllerFileName = `${targetFolder}/${objectName}.component.ts`;
  createFile(controllerFileName, generatedController);

  const generatedServiceModel = createComponentHTML(propertyMap);
  const serviceModelFileName = `${targetFolder}/${objectName}.component.html`;
  createFile(serviceModelFileName, generatedServiceModel);

  const generatedServiceImpl = createComponentCSS(propertyMap);
  const serviceFileName = `${targetFolder}/${objectName}.component.css`;
  createFile(serviceFileName, generatedServiceImpl);
}
