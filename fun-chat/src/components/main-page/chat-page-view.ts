import { createElement } from "../../services/element-generator";
import { LogOutServis } from "../../services/logout-service";
import { StoreService } from "../../services/session-storage";
import { ChatControlService } from "../../services/chat-control-service";
import { Message } from "../../types/types";
import { ChatController } from "./chat-page-controller";

export class ChatPageView {
  chatContainer!: HTMLElement
  chatWrapper!: HTMLElement
  main!: HTMLElement
  infoButton!: HTMLElement
  infoMenu!: HTMLElement
  menuUsers!: HTMLElement
  userArea!: HTMLElement
  dialogContent!: HTMLElement
  letUserLogOut: LogOutServis;
  chatControlService: ChatControlService;
  isEditMode = false

  constructor(public chatController: ChatController) {
    this.letUserLogOut = new LogOutServis();
    this.chatControlService = new ChatControlService();
  }

  public createMainPage(): void {
    this.main = createElement({
      tag: "main",
      classes: ["main-chat-page"],
      parent: document.body,
    });

    const footerInfo = createElement({
      tag: "footer",
      classes: ["footer-info"],
      parent: this.main,
  });

    const logoImg = createElement({
        tag: "img",
        attributes: { src: "./assets/rs_school.svg", alt: "RSSchool" },
        parent: footerInfo,
    });

    const githubLink = createElement({
        tag: "a",
        attributes: { href: "https://github.com/MaruyYak" },
        text: "MaruyYak",
        parent: footerInfo,
    });

    const yearSpan = createElement({
        tag: "span",
        text: "2023",
        parent: footerInfo,
    });
  }

  public createChatContainer(): void {
    this.chatContainer = createElement({
      tag: "div",
      classes: ["chat-container"],
      parent: this.main,
    });

    const chatHeader = createElement({
      tag: "div",
      classes: ["chat-header"],
      parent: this.chatContainer,
    });

    createElement({
      tag: "h1",
      text: "FUN CHAT",
      parent: chatHeader,
    });

    const usersData = createElement({
      tag: "div",
      classes: ["user-data"],
      parent: chatHeader,
    });
    
    const saveUsersLogin =  StoreService.getUserData()

    createElement({
      tag: "p",
      classes: ["my-login"],
      text: `${saveUsersLogin?.login}`,
      parent: usersData,
    });


    createElement({
      tag: "img",
      classes: ["avatar"],
      src: "./assets/user-avatar.gif",
      parent: usersData,
    });

    this.chatWrapper = createElement({
      tag: "div",
      classes: ["chat-wrapper"],
      parent: this.chatContainer,
    });
  }

  public createChatMenu(): void {
    const chatMenu = createElement({
      tag: "div",
      classes: ["chat-menu"],
      parent: this.chatWrapper,
    });

    const menuButtons = createElement({
      tag: "div",
      classes: ["menu-buttons"],
      parent: chatMenu,
    });

    const exitButton = createElement({
      tag: "div",
      classes: ["exit-btn"],
      parent: menuButtons,
    });

    exitButton.addEventListener('click', () => {
      const loginedUser = StoreService.getUserData();
      this.letUserLogOut.letUserLogOut(loginedUser)
    })

    createElement({
      tag: "img",
      src: './assets/log-out.png',
      parent: exitButton,
    });

    this.infoButton = createElement({
      tag: "div",
      classes: ["info-btn"],
      parent: menuButtons,
    });

    createElement({
      tag: "img",
      src: './assets/info-icon.png',
      parent: this.infoButton,
    });
    
    this.infoButton.addEventListener("click", () => {
        this.userArea.classList.add('user-area_closed')
        this.infoButton.classList.add('selected')

        this.infoMenu.classList.remove('chat-info_closed')
        this.menuUsers.classList.remove('selected')
    });

    this.menuUsers = createElement({
      tag: "div",
      classes: ["info-users", "selected"],
      parent: menuButtons,
    });

    createElement({
      tag: "img",
      src: './assets/users-list.png',
      parent: this.menuUsers,
    });

    this.menuUsers.addEventListener("click", () => {
        this.userArea.classList.remove('user-area_closed')
        this.menuUsers.classList.add('selected')

        this.infoMenu.classList.add('chat-info_closed')
        this.infoButton.classList.remove('selected')
    });
  }

  public createUsersArea(): void {
    this.userArea = createElement({
      tag: "div",
      classes: ["user-area"],
      parent: this.chatWrapper,
    });

    const search = createElement({
      tag: "input",
      attributes: {
        id: "search",
        type: "text",
        placeholder: "Search",
      },
      parent: this.userArea,
    });
    
    createElement({
      tag: "ul",
      classes: ["user-list"],
      parent:this.userArea,
    });

  }

  public createChatInfo(): void {
    this.infoMenu = createElement({
        tag: "div",
        classes: ["chat-info", "chat-info_closed"],
        parent: this.chatWrapper,
    });

    const infoTitle = createElement({
        tag: "h3",
        classes: ["info-title"],
        text: "FUN CHAT",
        parent: this.infoMenu,
    });

    const logoImg = createElement({
        tag: "img",
        attributes: { src: "./assets/logo.png", alt: "logo" },
        parent: this.infoMenu,
    });

    const infoText = createElement({
        tag: "p",
        text: "You have access to a list of all users who were also logged in earlier. You can select any user from the list and start a dialogue with them. "
         + "It was designed in order to train working with websocket as part of the RSschool JS/FE 2023Q3 course",
        parent: this.infoMenu,
    });

    const authorLink = createElement({
        tag: "a",
        attributes: { href: "https://github.com/MaruyYak" },
        text: "By MARYYAK",
        parent: this.infoMenu,
    });

  }
  
  public createChat(): void {
    const chatContent = createElement({
        tag: "div",
        classes: ["chat-content"],
        parent: this.chatWrapper,
    });

    const chatArea = createElement({
        tag: "div",
        classes: ["chat-area"],
        parent: chatContent,
    });

    const friendInfo = createElement({
        tag: "div",
        classes: ["open-user-info"],
        parent: chatArea,
    });

    const friendName = createElement({
        tag: "label",
        classes: ["open-user"],
        text: "Chat with:",
        parent: friendInfo,
    });

    const friendStatus = createElement({
        tag: "span",
        id: "openUserStatus",
        parent: friendInfo,
    });

    this.dialogContent = createElement({
        tag: "div",
        classes: ["dialog-content"],
        parent: chatArea,
    });

    createElement({
        tag: "span",
        text: "Select the user to send the message to...",
        classes: ["dialog-empty"],
        parent: this.dialogContent,
    });

    const messageArea = createElement({
        tag: "div",
        classes: ["message-area"],
        parent: chatArea,
    });

    const messageInput = createElement({
        tag: "input",
        id: "textPlace",
        attributes: { 
          type: "text", 
          placeholder: "Message...",
          required: `${true}`
        },
        parent: messageArea,
    }) as HTMLInputElement;

    messageInput.disabled = true


    const saveButton = createElement({
        tag: "button",
        id: "saveBtn",
        classes: ["send-button"],
        text: "Save",
        parent: messageArea,
    }) as HTMLButtonElement;

    saveButton.style.display = "none"

    const sendButton = createElement({
        tag: "button",
        id: "sendBtn",
        classes: ["send-button"],
        text: "Send",
        parent: messageArea,
    }) as HTMLButtonElement;

      sendButton.disabled = true
  }

  public createNewMessage(messageDetails: Message, className: string, dateTime: string): HTMLElement {
    const messageContainer = createElement({
      tag: "div",
      classes: ["message-container", className],
      parent: this.dialogContent,
    });

    const messageContent = createElement({
        tag: "div",
        classes: ["message-content"],
        parent: messageContainer,
    });

    const mesMenu = createElement({
      tag: "div",
      id: 'mes-menu',
      parent: messageContent,
    });
    mesMenu.style.visibility = 'hidden'

    createElement({
      tag: "span",
      text: "Edit",
      id: 'edit',
      parent: mesMenu,
    });

    createElement({
      tag: "span",
      text: "Delete",
      id: 'delete',
      parent: mesMenu,
    });

    createElement({
        tag: "p",
        text: `${messageDetails.from }`,
        classes: ["mes_from"],
        parent: messageContent,
    });

    const messageText = createElement({
        tag: "p",
        classes: ["text"],
        text: `${messageDetails.text}`,
        parent: messageContent,
    });

    let isContextMenuOpen = false; 

    if(className === "to") {      
      messageText.addEventListener('contextmenu', (event) => {
        event.preventDefault();
        if (!isContextMenuOpen) {
            mesMenu.style.visibility = 'visible';
            isContextMenuOpen = true;
        } else {
            mesMenu.style.visibility = 'hidden';
            isContextMenuOpen = false;
        }
       });

        document.addEventListener('click', (event) => {
          if (!mesMenu.contains(event.target as Node)) {
            mesMenu.style.visibility = 'hidden';
            isContextMenuOpen = false;
          }
        });
        
        mesMenu.addEventListener('click', (event) => {
          const clickedMenu = event.target as HTMLElement;
          if(clickedMenu.id === "edit"){
            this.chatController.requestEditMessage(messageDetails);
            mesMenu.style.visibility = 'hidden';
            isContextMenuOpen = false;
          }
          if(clickedMenu.id === "delete") {
            ChatControlService.requestTextDeleting(messageDetails);
            mesMenu.style.visibility = 'hidden';
            isContextMenuOpen = false;
          }
      })
    }


    const messageInfo = createElement({
        tag: "div",
        classes: ["message-info"],
        parent: messageContent,
    });

    createElement({
        tag: "label",
        id: "dateTime",
        text: `${dateTime}`,
        parent: messageInfo,
    });

    const unreadMark = createElement({
        tag: "div",
        classes: ["unread-mark"],
        parent: messageInfo,
    });

    createElement({
      tag: "img",
      classes: ["unread"],
      src: './assets/mark-unread.png',
      parent: unreadMark,
    });

    className === "to" ? unreadMark.style.display = "flex" : "none"

    createElement({
      tag: "img",
      classes: ["unread"],
      src: './assets/mark-unread.png',
      parent: unreadMark,
    });
    
    const readMark = createElement({
      tag: "div",
      classes: ["read-mark"],
      parent: messageInfo,
    });

    createElement({
      tag: "img",
      classes: ["readed"],
      src: './assets/mark-readed.png',
      parent: readMark,
    });

    createElement({
      tag: "img",
      classes: ["readed"],
      src: './assets/mark-readed.png',
      parent: readMark,
    });

    const edit = createElement({
      tag: "img",
      classes: ["edited"],
      src: './assets/edited.png',
      parent: messageInfo,
    }) as HTMLElement;

    edit.style.display = "none";

    return messageContainer;
  }
}
