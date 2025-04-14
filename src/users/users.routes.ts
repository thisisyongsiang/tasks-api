import { ApiRoute, ApiRouter } from "../router";
import {
  userLoginAuthSchema,
  userSignUpAuthSchema,
} from "../validator/user.schema.validators";
import { requestBodyValidator } from "../validator/validator";
import { userLogin, userSignUp } from "./users.controller";

class UsersRouter extends ApiRouter {
  routes: ApiRoute[] = [
    {
      method: "post",
      path: "/signup",
      handlers: [requestBodyValidator(userSignUpAuthSchema), userSignUp],
    },
    {
      method: "post",
      path: "/login",
      handlers: [requestBodyValidator(userLoginAuthSchema), userLogin],
    },
  ];
}

export const users = new UsersRouter().configure();
