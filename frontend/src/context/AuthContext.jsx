/* eslint-disable react/prop-types */
import { createContext, useContext, useState } from "react";
import { useCookies } from "react-cookie";

const AuthContext = createContext();
const decodeJwt = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
};
export const AuthProvider = ({ children }) => {
  const [cookies, setCookie, removeCookie] = useCookies(["chatmatejwt"]);
  const [user, setUser] = useState(
    cookies.chatmatejwt ? decodeJwt(cookies.chatmatejwt) : null
  );

  const login = (token) => {
    setCookie("chatmatejwt", token, { path: "/" });
    setUser(decodeJwt(token));
  };

  const logout = () => {
    removeCookie("chatmatejwt");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
