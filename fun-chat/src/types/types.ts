export interface HtmlElementOptions {
  tag?: string;
  text?: string | number;
  parent?: HTMLElement;
  classes?: Array<string>;
  src?: string;
  style?: { [key: string]: string };
  id?: string;
  type?: string;
  attributes?: { [key: string]: string };
}

export interface UserData {
  id: string;
  type: string;
  payload: {
    user: {
      loging: string;
      pssword: string;
    }
  }
}

export interface LoginedUser {
  login: string;
  password: string;
  isLogined: boolean;
}

export interface User {
  login: string;
  isLogined: boolean;
}

export interface Message {
  id: string,
  from: string,
  to: string,
  text: string,
  datetime: number,
  status: {
    isDelivered: boolean,
    isReaded: boolean,
    isEdited: boolean,
    isDeleted: boolean
  }
}

