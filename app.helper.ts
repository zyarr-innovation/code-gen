import path from "path";
import { IPropertyMap } from "./app.common";

import { generateServerCode } from "./0.server-code/100.generate.server.code";
import { generateClientCode } from "./1.client-code/100.generate.client.code";

export function generateCode(propertyMap: IPropertyMap) {
  const targetServerFolder = path.resolve(
    __dirname,
    "./server/" + propertyMap.name.toLowerCase()
  );
  const targetClientFolder = path.resolve(
    __dirname,
    "./client/" + propertyMap.name.toLowerCase()
  );

  generateServerCode(targetServerFolder, propertyMap);
  generateClientCode(targetClientFolder, propertyMap);
}
