import { LoginedUser } from "../types/types";

export class StoreService {
  public static getUserData(): LoginedUser | null {
    const storedData = sessionStorage.getItem("LoginedUser");
    if (storedData) {
      return JSON.parse(storedData);
    }
    return null;
  }

  public static getUserGender(): string | null {
    const storedData = sessionStorage.getItem("UserGender");
    if (storedData) {
      return JSON.parse(storedData);
    }
    return null;
  }

  public static setUserGender(userGender: string) {
    sessionStorage.setItem("UserGender", JSON.stringify(userGender));
  }

  public static setUserData(loginedUser: LoginedUser) {
    sessionStorage.setItem("LoginedUser", JSON.stringify(loginedUser));
  }

  public static removeUserData(): void {
    sessionStorage.removeItem("LoginedUser");
    sessionStorage.removeItem("UserGender");
  }
}