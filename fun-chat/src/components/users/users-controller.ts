import { createElement } from "../../services/element-generator";
import { ChatControlService } from "../../services/chat-control-service";
import { User } from "../../types/types";
import { ChatController } from "../main-page/chat-page-controller";


export class UserListController {
  chatController: ChatController;
  userList: User[] = [];
  userListArr: {user: User, htmlEl: HTMLElement}[] = [];

  constructor() {
    this.chatController = new ChatController();
  }

  public addUserList(users: User[]) {
    this.userList = [...this.userList, ...users]
    this.drawUserItems();
    this.setEventListenertoUser();
    this.searchUsers();
  }

  public drawUserItems() {
    const domUsersList = document.querySelector('.user-list') as HTMLUListElement
    const myLogin = document.querySelector('.my-login')?.textContent
    domUsersList.innerHTML = ""

    this.userList.filter((notme) => notme.login !== myLogin)
    .forEach(user => {
      const userItem = createElement({
        tag: "li",
        classes: ['user'],
        text: user.login,
        parent: domUsersList
      });
      const classStus = user.isLogined ? ["online"] : ["offline"]
      createElement({
        tag: "span",
        classes: ["status", `${classStus}`],
        parent: userItem
      });
      this.userListArr.push({user: user, htmlEl: userItem})
    });

  }

  public setStatus(user: User) {
    const externalUser = this.userList.find(item => item.login === user.login);
    if(externalUser){
      externalUser.isLogined = user.isLogined;
    } else {
      this.userList.push(user)
    }
    this.drawUserItems()
  }

  private setEventListenertoUser() {
    const usersList = document.querySelector(".user-list") as HTMLLIElement
    const textPlace = document.getElementById("textPlace") as HTMLInputElement

    usersList.addEventListener('click', (event) => {
      if(textPlace.value != "") {
        textPlace.value = ""
      }
      const clickedListItem = event.target as HTMLLIElement;
      const openUserhtml = document.querySelector('.open-user') as HTMLInputElement
      const openUserStatus = document.getElementById('openUserStatus') as HTMLInputElement

      if(!clickedListItem.classList.contains("user")) {
        return;
      }
    
      const openUserLogin = clickedListItem.textContent;
      openUserhtml.innerText = `Chat with: ${openUserLogin}`;
      const finededUser = this.userList.find(user => user.login === openUserLogin);
      
      if(!finededUser || openUserLogin === ChatControlService.selectedUser?.login) {
        return;
      }

      this.chatController.clearChatWindow()
      ChatControlService.selectUser(finededUser);    
      ChatControlService.getMessageHistory(finededUser.login)
      
      if(finededUser && finededUser.isLogined) {
        openUserStatus.classList.add("online")
        openUserStatus.classList.remove("offline")
      } else {
        openUserStatus.classList.remove("online")
        openUserStatus.classList.add("offline")
      }
      
    });
  }

  public searchUsers(): void {
    const searchInput = document.getElementById('search') as HTMLInputElement;
    searchInput.addEventListener('input', () => {
      const searchText = searchInput.value.toLowerCase();
      this.userListArr.forEach(user => {
          const userStatus = document.querySelector('.status') as HTMLLIElement;
            const userName = user.user.login.toLowerCase();
            if (userName?.includes(searchText)) {
                user.htmlEl.style.display = 'flex'; 
                userStatus.style.display = 'flex'
            } else {
                user.htmlEl.style.display = 'none';
                userStatus.style.display = 'none'
            }
        });
    });
  }
}
