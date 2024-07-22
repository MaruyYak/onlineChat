import { ChatControlService } from "../../services/chat-control-service";
import { createElement } from "../../services/element-generator";
import { Message } from "../../types/types";
import { ChatPageView } from "./chat-page-view";

export class ChatController {
  viewChatPage: ChatPageView;
  chatControlService: ChatControlService;
  messagesArr: {message: Message, htmlEl: HTMLElement}[] = [];
  isMyScroll = false;
  editedMessage: Message | null = null;

  constructor() {
    this.viewChatPage = new ChatPageView(this);
    this.chatControlService = new ChatControlService();
  }
  

  public drawChatPage() {
    document.body.innerHTML = "";
    this.viewChatPage.createMainPage();
    this.viewChatPage.createChatContainer();
    this.viewChatPage.createChatMenu();
    this.viewChatPage.createUsersArea();
    this.viewChatPage.createChatInfo();
    this.viewChatPage.createChat();
    this.chatControlService.getUsersList();

    this.setEventListenersToMessage();
    this.setEventListenersToSentButton();
  }

  public clearChatWindow() {
    const messageInput = document.getElementById('textPlace') as HTMLInputElement;
    const dialogContent = document.querySelector('.dialog-content') as HTMLElement;
    const sendButton = document.getElementById('sendBtn') as HTMLInputElement;
    const saveButton = document.getElementById('saveBtn') as HTMLInputElement;
    
    dialogContent.innerHTML = ""

    if(saveButton.style.display === "flex") {
      saveButton.style.display = "none"
      sendButton.style.display = "flex"
    }
  
    messageInput.disabled = false;
    sendButton.disabled = false;
   }
  
  public showMessage(messageContent: Message): HTMLElement {
    const dialogContent = document.querySelector('.dialog-content') as HTMLElement
    const className = messageContent.to === ChatControlService.selectedUser.login ?
    'to' : 'from';
    
    const date = new Date(messageContent.datetime);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    const dateTimeString = `${month}-${day}  ${hours}:${minutes}`;
    const messageHtml = this.viewChatPage.createNewMessage(messageContent, className, dateTimeString);
    this.messagesArr.push({message: messageContent, htmlEl: messageHtml})
    const unreadMark = messageHtml.querySelector(".unread-mark") as HTMLElement;
    const readMark =  messageHtml.querySelector(".read-mark") as HTMLElement;
    const editdMark =  messageHtml.querySelector(".edited") as HTMLElement;

    if(messageContent.status.isReaded && messageContent.to === ChatControlService.selectedUser.login) {
      unreadMark.style.display = 'none';
      readMark.style.display = 'flex';
    }
    if(messageContent.status.isEdited) {
      editdMark.style.display = 'flex';      
    }

    this.isMyScroll = true;
    dialogContent.scrollTop = dialogContent.scrollHeight;
      setTimeout(() => {
        this.isMyScroll = false;
      }, 500)

    return messageHtml;
  }
  
  public showMessagesHistory(messages: Message[]) {
    console.log("messages history", messages)
    this.messagesArr = messages.map((message) => ({
      message,
      htmlEl: this.showMessage(message)
    }))
  }

  public setReadStatus(message: Message) {
    const readMessage = this.messagesArr.find(mes => mes.message.id === message.id)
    if(readMessage) {
      readMessage.message.status.isReaded = true;
      this.messagesArr.push({message: readMessage.message, htmlEl: readMessage.htmlEl})
    }

    if(readMessage?.message.to !== ChatControlService.selectedUser.login) {
      return
    }

    const unreadMark = readMessage?.htmlEl.querySelector(".unread-mark") as HTMLElement;
    const readMark =  readMessage?.htmlEl.querySelector(".read-mark") as HTMLElement;

    unreadMark.style.display = 'none';
    readMark.style.display = 'flex';
  }
  
  public requestEditMessage(message: Message) {
    this.editedMessage = message;

    const messageInput = document.getElementById('textPlace') as HTMLInputElement;
    const saveButton = document.getElementById('saveBtn') as HTMLButtonElement;
    const sendButton = document.getElementById('sendBtn') as HTMLButtonElement;

    messageInput.value = message.text; 
    saveButton.style.display = "flex"
    sendButton.style.display = "none"
  }

  public editMessage(message: Message) {   
    const saveButton = document.getElementById('saveBtn') as HTMLInputElement;
    const textInput = document.getElementById('textPlace') as HTMLInputElement;
    const sendButton = document.getElementById('sendBtn') as HTMLInputElement;
    textInput.value = ""
    saveButton.style.display = "none"
    sendButton.style.display = "flex"

    const editedMessage = this.messagesArr.find(mes => mes.message.id === message.id);
    if(editedMessage) {
      editedMessage.message.status.isEdited = true;
      this.messagesArr.push({message: editedMessage.message, htmlEl: editedMessage.htmlEl})
    }
    const changeText = editedMessage?.htmlEl.querySelector(".text") as HTMLElement;
    const edited = editedMessage?.htmlEl.querySelector('.edited') as HTMLInputElement;
   if(changeText) {   
      edited.style.display = "flex"
     changeText.innerText = message.text
   }      
  }
  
  public deleteMessage(message: Message) {
    const findMessage = this.messagesArr.filter(mes => mes.message.id !== message.id);
    this.clearChatWindow();
    this.showMessagesHistory(findMessage.map(mes => mes.message));
  }

  public setEventListenersToMessage() {
    const dialogContent = document.querySelector(".dialog-content") as HTMLElement;
    const sendButton = document.querySelector(".send-button") as HTMLElement;
    
    dialogContent.addEventListener('scroll', () => {
      if(!this.isMyScroll) {
        this.readMessages();
      }
    });
    
    dialogContent.addEventListener('click', () => {
        this.readMessages();
    });

    sendButton.addEventListener('click', () => {
        this.readMessages();
    });
   
    sendButton.addEventListener('keydown', (event) => {
          event.preventDefault();
        if (event.key === "Enter") {
          this.readMessages();          
        }
      });
  }

  public readMessages() {
    this.messagesArr.forEach(item => {
      if(!item.message.status.isReaded && ChatControlService.selectedUser.login === item.message.from) {
        ChatControlService.requestReadStatus(item.message.id)
      }
    })
  }

  public setEventListenersToSentButton() {
    const messageInput = document.getElementById('textPlace') as HTMLInputElement;
    const sendButton = document.getElementById('sendBtn') as HTMLInputElement;
    const mesMenu = document.getElementById('mes-menu') as HTMLInputElement;
    const saveButton = document.getElementById('saveBtn') as HTMLButtonElement;
    
    saveButton.addEventListener("click", () => {
      ChatControlService.requestTextEditing(this.editedMessage?.id || '0' , messageInput.value)
      this.editedMessage = null;
    })

    document.addEventListener('keydown', (event) => {
      if (event.key === "Escape" && this.editedMessage) {
        this.editedMessage = null;
        sendButton.style.display = "flex";
        saveButton.style.display = "none";
        messageInput.value = "";
        mesMenu.style.visibility = 'hidden';
      }
    });

    sendButton.addEventListener('click', () => {
      if (messageInput.value != '') {
        ChatControlService.sendMessageToUser(messageInput.value)
        messageInput.value = ""
      }
    });

    messageInput.addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.key !== "Enter") {
        return;
      }
      event.preventDefault();
      if (messageInput.value === '') {
        return;
      }
      if(this.editedMessage) {
        ChatControlService.requestTextEditing(this.editedMessage.id, messageInput.value);
        this.editedMessage = null;
      } else {
        ChatControlService.sendMessageToUser(messageInput.value);
      }

      messageInput.value = "";
    });
  }
}