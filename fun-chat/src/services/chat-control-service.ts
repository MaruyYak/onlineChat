import { ApplicationEvents } from "../components/app-server/application-events-server";
import { Message, User } from "../types/types";

export class ChatControlService {
  
  static selectedUser: User;

  static selectUser(user: User) {
    this.selectedUser = user
  }

  public getUsersList(): void {
    ["USER_ACTIVE","USER_INACTIVE"].forEach(type => {
      const payload = null
      ApplicationEvents.send(type, payload);
    })
  }
  
  static sendMessageToUser(message: string): void {
    const type = "MSG_SEND";
    const payload = {
            message: {
              to: ChatControlService.selectedUser.login,
              text: message,
            }
          };
    ApplicationEvents.send(type, payload);
  }

  static getMessageHistory(login: string) {
    const type = "MSG_FROM_USER";
    const payload = {
            user: {
              login: login,
            }
          };
    ApplicationEvents.send(type, payload);
  }

  static requestReadStatus(messageId: string) {
    const type = "MSG_READ";
    const payload = {
        message: {
              id: messageId,
            }
          };
    ApplicationEvents.send(type, payload);
  }

  static requestTextEditing(id:string , text: string) {
    const type = "MSG_EDIT";
    const payload = {
        message: {
            id: id,
            text: text
            }
          };
    ApplicationEvents.send(type, payload);
  }

  static requestTextDeleting(message: Message) {
    const type = "MSG_DELETE";
    const payload = {
        message: {
            id: message.id,
            }
          };
    ApplicationEvents.send(type, payload);
  }
}