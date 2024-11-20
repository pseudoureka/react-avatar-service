import { createContext, useContext, useState } from "react";
import axios from "../lib/axios";

const AuthContext = createContext({
  user: null,
  avatar: null,
  login: () => {},
  logout: () => {},
  updateMe: () => {},
  updateAvatar: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [avatar, setAvatar] = useState(null);

  async function getMe() {
    const res = axios.get("/users/me");
    const nextUser = res.data;
    setUser(nextUser);
  }

  async function getMyAvatar() {
    const res = await axios.get("/users/me/avatar");
    const avatar = res.data;
    setAvatar(avatar);
  }
  async function login({ email, password }) {
    axios.post("/auth/login", { email, password });

    await getMe();
    await getMyAvatar();
  }

  async function logout({ email, password }) {
    /** @TODO 로그아웃 구현하기 */
  }

  async function updateMe(formData) {
    const res = await axios.patch("/users/me", formData);
    const nextUser = res.data;
    setUser(nextUser);
  }

  async function updateAvatar(values) {
    const res = await axios.patch("users/me/avatar", values);
    const nextAvatar = res.data;
    setAvatar(nextAvatar);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        avatar,
        login,
        logout,
        updateMe,
        updateAvatar,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext();
  if (!context) {
    throw new Error("반드시 AuthProvider 안에서 생성되어야 합니다.");
  }

  return context;
}
