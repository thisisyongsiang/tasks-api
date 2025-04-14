import { RequestHandler, Router } from "express";

export abstract class ApiRouter {
  protected router: Router;
  abstract routes: ApiRoute[];

  constructor() {
    this.router = Router({ mergeParams: true });
  }

  configure(): Router {
    return this.routes.reduce<Router>((router, route) => {
      return router[route.method](route.path, ...route.handlers);
    }, this.router);
  }
}

export interface ApiRoute {
  method:
    | "all"
    | "get"
    | "post"
    | "put"
    | "delete"
    | "patch"
    | "options"
    | "head";
  path: string;
  handlers: RequestHandler[];
}
