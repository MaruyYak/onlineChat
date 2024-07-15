import { ApplicationEvents } from "../components/app-server/application-events-server";
import { StoreService } from "./session-storage";
import { ChatControlService } from "./chat-control-service";

export class LoginService {
  
  public letUserLogin(login: string, password: string): void {
    const type = "USER_LOGIN";
    const payload = {
            user: {
              login: login,
              password: password
            }
          };

    const passwordObj = {
            login: "",
            password: password,
            isLogined: false,
          }
    
    StoreService.setUserData(passwordObj);
    ApplicationEvents.send(type, payload);
  }
}
