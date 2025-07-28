import { IProperty, IPropertyMap } from "../app.common";

export function createContainerBase() {
  return `
  import { Container } from "inversify";
  import TYPES from "./types";

  import { BaseController } from "../common/base-controller";
  import { ILogger, LoggerService } from "../common/service/logger.service";
  import { ServiceTenant } from "../common/service/tenant.service";
  import { RequestContextProvider } from "../common/service/request-context.service";
  import { MiddlewareProvider } from "../common/service/middleware.service";
  import { Validate } from "../common/validate";

  const container = new Container();
  container.bind<ILogger>(TYPES.LoggerService).to(LoggerService);
  container.bind(ServiceTenant).toSelf().inSingletonScope();
  container.bind(RequestContextProvider).toSelf().inSingletonScope();
  container.bind(MiddlewareProvider).toSelf().inSingletonScope();
  container.bind<Validate>(Validate).to(Validate);
  `;
}

export function createContainerFromObjectMap(
  propertyMap: IPropertyMap
): string {
  const { name, properties } = propertyMap;

  let containerString = `
    import { Controller${name} } from "../${name.toLowerCase()}/2.controller";
    import { IService${name} } from "../${name.toLowerCase()}/3.service.model";
    import { Service${name}Impl } from "../${name.toLowerCase()}/4.service";
    import { IRepo${name} } from "../${name.toLowerCase()}/5.repo.model";
    import { Repo${name}Impl } from "../${name.toLowerCase()}/6.repo";

    container.bind<Controller${name}>(TYPES.Controller${name}).to(Controller${name});
    container.bind<IService${name}>(TYPES.Service${name}).to(Service${name}Impl);
    container.bind<IRepo${name}>(TYPES.Repo${name}).to(Repo${name}Impl);
  `;

  return containerString;
}
