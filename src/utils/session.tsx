import * as Cookies from "js-cookie";


export const setSessionCookie = (session: any): void => {
  Cookies.remove("session");
  Cookies.set("session", JSON.stringify(session), { expires: 14 });
};

export const unsetSessionCookie = (session: any): void => {
  Cookies.remove("session");
};

export const getSessionCookie: any = () => {
  const sessionCookie = Cookies.get("session");
  if (sessionCookie === undefined) {
    return false;
  } else {
    return JSON.parse(sessionCookie);
  }
};