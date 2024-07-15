import { createElement } from "../../services/element-generator";
import { LoginService } from "../../services/login-service";
import { AuthPageView } from "./auth-page-view";

export class AuthController {
  viewAuth!: AuthPageView;

  constructor(loginService: LoginService) {
    console.log("loginService1", loginService)
    this.viewAuth = new AuthPageView(this, loginService);
  }
  
  public drawAuthPage() {
    document.body.innerHTML = "";
    this.viewAuth.createAuthPage();
    this.viewAuth.createAuthForm();
  }

  public inputsValidation(input: HTMLInputElement, errorElement: HTMLElement): void {
    const joinBtn = document.getElementById("join-btn") as HTMLInputElement;

    joinBtn.disabled = true;
    let hasError = false;

    const validUserCharacters = /^[a-zA-Zа-яА-Я0-9_-]{3,20}$/;

    const validPasswordCharacters = /^.{4,}$/;

    if (input.id === "username") {
        if (!validUserCharacters.test(input.value)) {
            hasError = true;
            errorElement.innerText = "Username must be 3-20 characters long and can contain letters, numbers, underscores, and dashes.";
            return;
        }
    }

    if (input.id === "password") {
      if (!validPasswordCharacters.test(input.value)) {
          hasError = true;
          errorElement.innerText = "Password must be at least 4 characters long.";
          return;
      }
  }
    errorElement.innerText = "";
    joinBtn.disabled = hasError;
  }

    public loginError(error: string) {

      const modalError = createElement({
        tag: "div",
        classes: ["modal-error"],
        parent: document.body
      })

      modalError.style.display = "flex"
  
     const errorContainer = createElement({
        tag: "div",
        classes: ["error-container"],
        parent: modalError
      })
  
     createElement({
        tag: "p",
        text: `${error}`,
        parent: errorContainer
      })
  
     const closeBtn = createElement({
        tag: "button",
        text: "OK",
        parent: errorContainer
      })

      document.addEventListener('keydown', (event) => {
        if (event.key === "Escape" || event.key === "Enter") {
          event.preventDefault();
          modalError.style.display = "none"
        }
      });

      closeBtn.addEventListener("click", () => {
        modalError.style.display = "none"
      })
    }

  }


