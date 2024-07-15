import { createElement } from "../../services/element-generator";
import { AuthController } from "./auth-page-controller";
import { LoginService } from "../../services/login-service";
import { StoreService } from "../../services/session-storage";

export class AuthPageView {
  authMainContainer!: HTMLElement;
  signupForm!: HTMLElement;

  constructor(
    private authController: AuthController, 
    private loginService: LoginService
  ) {}

  public createAuthPage(): void {
    this.authMainContainer = createElement({
      tag: "main",
      classes: ["main-auth"],
      parent: document.body,
    });
  }
  
  public createAuthForm(): void {
    const signupSection = createElement({
      tag: "div",
      classes: ["signup-section"],
      parent: this.authMainContainer,
    })

    const infoContent = createElement({
      tag: "div",
      classes: ['info-content'],
      parent: signupSection,
    })

    const infoButton = createElement({
      tag: "div",
      classes: ['info-button'],
      parent: signupSection,
    })

    const seeInfobtn = createElement({
      tag: "p",
      text: 'SEE INFO',
      classes: ['button-text'],
      parent: infoButton,
    })

    infoButton.addEventListener("click", () => {
      infoContent.classList.toggle('open')
      if(infoContent.classList.contains('open')) {
        setTimeout(() => {
          seeInfobtn.innerText = 'CLOSE INFO'
        }, 1000)
      } else {
        setTimeout(() => {
          seeInfobtn.innerText = 'SEE INFO'
        }, 1000)
      }
    });

    createElement({
      tag: "h2",
      text: 'FAN CHAT is a lite version of the messenger for simple and active communication. After registration, you will have access to a list of all users who were also logged in earlier. You can select any user from the list and start a dialogue with them. It was designed in order to train working with websocket as part of the RSschool JS/FE 2023Q3 course',
      parent: infoContent,
    })

    createElement({
      tag: "a",
      text: "By MARYAK",
      parent: infoContent,
      attributes: {
        href: "https://github.com/MaruyYak",
      },
    });

    this.signupForm = createElement({
      tag: "form",
      classes: ["signupForm"],
      parent: signupSection,
      attributes: {
        id: 'signupform',
      },
    });

    createElement({
      tag: "h2",
      text: "Sign Up",
      parent: this.signupForm,
    });

    const formList = createElement({
      tag: "ul",
      classes: ["no-bullet"],
      parent: this.signupForm,
    });


  ["username", "password"].forEach((placeholder) => {
    const listItem = createElement({
      tag: "li",
      classes: ['li_input'],
      parent: formList,
    });

    createElement({
      tag: "label",
      parent: listItem,
      attributes: {
        for: placeholder,
      },
    });

    const input = createElement({
      tag: "input",
      classes: ["inputFields"],
      parent: listItem,
      attributes: {
        type: placeholder === "password" ? "password" : "text",
        id: placeholder,
        name: placeholder,
        placeholder: placeholder,
        required: `${true}`
      },
    }) as HTMLInputElement;

    const errorId = `error_${placeholder}`;
    createElement({
        tag: "span",
        id: errorId,
        classes: ["error-mes"],
        parent: listItem,
    });

    const errorElement = document.getElementById(errorId) as HTMLSpanElement;
    
    input.addEventListener("input", () => {
      this.authController.inputsValidation(input, errorElement);
      });
    });

    // const radioButtons = createElement({
    //   tag: "div",
    //   classes: ["radio-buttons"],
    //   parent: formList
    // });

    // const maleLabel = createElement({
    //   tag: "label",
    //   text: "Male",
    //   attributes: {
    //     for: "male"
    //   },
    //   parent: radioButtons
    // });
    // const maleButton = createElement({
    //   tag: "input",
    //   attributes: {
    //     type: "radio",
    //     id: "male",
    //     value:"male",
    //   },
    //   parent: radioButtons
    // }) as HTMLInputElement;

    // const femaleLabel = createElement({
    //   tag: "label",
    //   text: "Female",
    //   attributes: {
    //     for: "female"
    //   },
    //   parent: radioButtons
    // });
    // const felameButton = createElement({
    //   tag: "input",
    //   attributes: {
    //     type: "radio",
    //     id: "female",
    //     value:"female",
    //   },
    //   parent: radioButtons
    // }) as HTMLInputElement;
    
    // maleButton.addEventListener("click", () => {
    //   if (maleButton.checked) {
    //     felameButton.checked = false
    //   }
    // })
    
    // felameButton.addEventListener("click", () => {
    //   if (felameButton.checked) {
    //     maleButton.checked = false
    //   }
    // })

    const joinBtnListItem = createElement({
      tag: "li",
      parent: formList,
      id: "center-btn",
    });

    const joinBtn = createElement({
      tag: "input",
      attributes: {
        type: "submit",
        id: "join-btn",
        name: "join",
        alt: "Join"
     },
      parent: joinBtnListItem,
    }) as HTMLInputElement;
    
    this.signupForm.addEventListener("submit", (event) => {
      let username =  (document.getElementById("username") as HTMLInputElement).value;
      let password = (document.getElementById("password") as HTMLInputElement).value;

      event.preventDefault()
      this.loginService.letUserLogin(username, password)
    });

    joinBtn.disabled = true;
  }

}