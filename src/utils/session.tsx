import * as Cookies from "js-cookie";
import jwt_decode from 'jwt-decode';


export const setSessionCookie = (session: any): void => {
  Cookies.remove("__jwtses__");
  Cookies.set("__jwtses__", JSON.stringify(session), { expires: 14 });
};

export const unsetSessionCookie = (session: any): void => {
  Cookies.remove("__jwtses__");
};

export const getSessionCookie: any = () => {
  const sessionCookie = Cookies.get("__jwtses__");
  if (sessionCookie === undefined) {
    return {
      tokenDecoded: {
      userId: null, 
      address: null, 
      status: false, 
      email: null, 
      name: null, 
      profileImage: null 
      },
      tokenNonDecoded: null
    }
  } else {
    return  {
       tokenDecoded: jwt_decode(JSON.parse(sessionCookie).accessToken),
       tokenNonDecoded: JSON.parse(sessionCookie)
    } 
  }
};