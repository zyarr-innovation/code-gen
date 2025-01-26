import fs, { stat } from "fs";

import { IProperty, IPropertyMap } from "../app.common";
import { createModelFromObjectMap } from "./0.model";
import { createValidatorFromObjectMap } from "./1.validator";
import { createControllerFromObjectMap } from "./2.controller";
import { createServiceModelFromObjectMap } from "./3.service.model";
import { createServiceImplFromObjectMap } from "./4.service";
import { createRepoModelFromObjectMap } from "./5.repo.model";
import { createRepoImplFromObjectMap } from "./6.repo";
import { createDtoModelFromObjectMap } from "./7.dto.model";
import { generateRestClientCode } from "./8.test";

function createFile(filePath: string, codeImpl: string) {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
  fs.writeFileSync(filePath, codeImpl);
}

export function generateServerCode(
  targetFolder: string,
  propertyMap: IPropertyMap,
  relation: { [key: string]: string[] }
) {
  if (!fs.existsSync(targetFolder)) {
    fs.mkdirSync(targetFolder, { recursive: true });
  }

  const generatedModel = createModelFromObjectMap(propertyMap);
  const modelFilePath = `${targetFolder}/0.model.ts`;
  createFile(modelFilePath, generatedModel);

  const generatedValidator = createValidatorFromObjectMap(propertyMap);
  const validatorFileName = `${targetFolder}/1.validator.ts`;
  createFile(validatorFileName, generatedValidator);

  const generatedController = createControllerFromObjectMap(propertyMap);
  const controllerFileName = `${targetFolder}/2.controller.ts`;
  createFile(controllerFileName, generatedController);

  const generatedServiceModel = createServiceModelFromObjectMap(propertyMap);
  const serviceModelFileName = `${targetFolder}/3.service.model.ts`;
  createFile(serviceModelFileName, generatedServiceModel);

  const generatedServiceImpl = createServiceImplFromObjectMap(propertyMap);
  const serviceFileName = `${targetFolder}/4.service.ts`;
  createFile(serviceFileName, generatedServiceImpl);

  const generateRepoModel = createRepoModelFromObjectMap(propertyMap);
  const repoModelFileName = `${targetFolder}/5.repo.model.ts`;
  createFile(repoModelFileName, generateRepoModel);

  const generatedRepoImpl = createRepoImplFromObjectMap(propertyMap);
  const repoFileName = `${targetFolder}/6.repo.ts`;
  createFile(repoFileName, generatedRepoImpl);

  const generatedDtoModel = createDtoModelFromObjectMap(propertyMap);
  const dtoFileName = `${targetFolder}/7.dto.model.ts`;
  createFile(dtoFileName, generatedDtoModel);

  const generatedRestClient = generateRestClientCode(propertyMap);
  const restClientFileName = `${targetFolder}/8.test.rest`;
  createFile(restClientFileName, generatedRestClient);
}
