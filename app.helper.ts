import path from "path";
import { IPropertyMap } from "./app.common";

import { generateServerCode } from "./0.server-code/100.generate.server.code";
import { generateClientCode } from "./1.client-code/100.generate.client.code";

export function generateCode(propertyMap: IPropertyMap, relation: {[key: string]: string[]}) {
  const targetServerFolder = path.resolve(
    __dirname,
    "./test/server/" + propertyMap.name.toLowerCase()
  );
  const targetClientFolder = path.resolve(
    __dirname,
    "./test/client/" + propertyMap.name.toLowerCase()
  );

  generateServerCode(targetServerFolder, propertyMap, relation);
  generateClientCode(targetClientFolder, propertyMap, relation);
}
