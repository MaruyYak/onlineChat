import "./styles.css";
import "./components/auth-page/auth.css"
import "./components/main-page/chat-page.css"
import { AuthController } from "./components/auth-page/auth-page-controller";
import { ChatController } from "./components/main-page/chat-page-controller";
import { StoreService } from "./services/session-storage";
import { ApplicationEvents } from "./components/app-server/application-events-server";
import { UserListController } from "./components/users/users-controller";
import { LoginService } from "./services/login-service";

let authController;
let chatController;
let userListController;
let loginService: LoginService

window.onload = () => {
  ApplicationEvents.connect();

  ApplicationEvents.ws.onopen = () => {
    userListController = new UserListController();
    chatController = new ChatController();
    loginService = new LoginService()
    authController = new AuthController(loginService);
    ApplicationEvents.setAppConrtollers(authController, chatController, userListController)
    const user = StoreService.getUserData();
    StoreService.getUserGender();
  
    if (user) {
      loginService.letUserLogin(user.login, user.password);
    } else {
      authController.drawAuthPage()
    }
  }
  
};