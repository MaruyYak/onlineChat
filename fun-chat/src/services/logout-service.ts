import { ApplicationEvents } from "../components/app-server/application-events-server";
import { LoginedUser } from "../types/types";

export class LogOutServis {

  public letUserLogOut(loginedUser:LoginedUser | null): void {
    const type = "USER_LOGOUT";
    const payload = {
            user: {
              login: loginedUser?.login,
              password: loginedUser?.password
            }
          };
    ApplicationEvents.send(type, payload);
  }
}
