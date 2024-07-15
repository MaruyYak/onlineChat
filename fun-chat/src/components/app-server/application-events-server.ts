import { v4 as uuid } from "uuid";
import { StoreService } from "../../services/session-storage";
import { AuthController } from "../auth-page/auth-page-controller";
import { ChatController } from "../main-page/chat-page-controller";
import { UserListController } from "../users/users-controller";
import { Message } from "../../types/types";
import { ChatControlService } from "../../services/chat-control-service";

export class ApplicationEvents {
  static ws: WebSocket;
  static authController: AuthController;
  static chatController: ChatController;
  static userListController: UserListController;
  
  public static connect()  {
    if(!ApplicationEvents.ws) {  
      ApplicationEvents.ws = new WebSocket("ws://127.0.0.1:4000");
      this.ws.onmessage = this.onMessage;
    }
  }

  public static setAppConrtollers( authController: AuthController, chatController: ChatController, userListController:UserListController) {
    this.authController = authController;
    this.chatController = chatController;
    this.userListController = userListController;
  }

  public static onMessage(this: WebSocket, ev: MessageEvent<any>) {
    const message = JSON.parse(ev.data)
    console.log("message", message);
    
    const messageType = message.type;
    switch (messageType) {
      case "USER_LOGIN":
        const savePas = StoreService.getUserData()
        const userLogin = message.payload.user;
        userLogin.password = savePas?.password;
        StoreService.setUserData(userLogin);
        ApplicationEvents.chatController.drawChatPage()
        ApplicationEvents.userListController.setStatus(userLogin)
        break;

      case "ERROR":
        console.log('message from ERROR',message.payload.error)
        ApplicationEvents.authController.loginError(message.payload.error)
        break;

      case "USER_LOGOUT":
        StoreService.removeUserData();
        ApplicationEvents.authController.drawAuthPage()
        break;

      case "USER_ACTIVE":
        const usersActive = message.payload.users;
        ApplicationEvents.userListController.addUserList(usersActive)
        break;
      
      case "USER_INACTIVE":
        const usersInactive = message.payload.users;
        ApplicationEvents.userListController.addUserList(usersInactive)

        break;
        
      case "USER_EXTERNAL_LOGIN":      
        ApplicationEvents.userListController.setStatus(message.payload.user)
        break;
      
      case "USER_EXTERNAL_LOGOUT":
        ApplicationEvents.userListController.setStatus(message.payload.user)
        break;

      case "MSG_SEND":
        const sendMessage = message.payload.message as Message
        if(sendMessage.from === ChatControlService.selectedUser.login || 
          sendMessage.to === ChatControlService.selectedUser.login) {
          ApplicationEvents.chatController.showMessage(message.payload.message)
        }
        break;

      case "MSG_FROM_USER":
        ApplicationEvents.chatController.showMessagesHistory(message.payload.messages)
        break;
        
      case "MSG_READ":
        ApplicationEvents.chatController.setReadStatus(message.payload.message)
       
      break;
      
      case "MSG_EDIT":
        console.log('message from MSG_EDIT', message.payload.message)
        ApplicationEvents.chatController.editMessage(message.payload.message)
      break;

      case "MSG_DELETE":
        console.log('message from MSG_DELETE', message.payload.message)
        ApplicationEvents.chatController.deleteMessage(message.payload.message)
      break;

      default:
        console.log(message.payload)
    }
  }

  public static send(type: string, payload: {[key:string]: any} | null) {
    const request = {
        id: `${uuid()}`,
        type,
        payload
    };
    console.log('type', type)
    ApplicationEvents.ws.send(JSON.stringify(request));
  }
}