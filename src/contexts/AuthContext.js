"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";

// 創建 Context
const AuthContext = createContext(undefined);

// 自定義 Hook，用於消費 AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// AuthProvider 組件
export const AuthProvider = ({ children }) => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 初始化驗證
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const user = await api.auth.me();
        setCurrentUser(user);
        setIsAdminAuthenticated(true);
      } catch (error) {
        console.error("認證失敗，需重新登錄：", error);
        localStorage.removeItem('authToken');
        setIsAdminAuthenticated(false);
        setCurrentUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // 管理員登錄
  const adminLogin = async (credentials) => {
    try {
      // 先清除之前的狀態
      localStorage.removeItem('authToken');
      setIsAdminAuthenticated(false);
      setCurrentUser(null);

      // 嘗試登錄
      console.log('Attempting login with credentials:', {
        username: credentials.username,
        passwordLength: credentials.password?.length
      });

      const { token, user } = await api.auth.login(credentials);
      console.log('Login successful, got token and user:', { user });
      
      // 存儲 token
      localStorage.setItem('authToken', token);
      console.log('Token stored in localStorage');

      // 直接使用登入響應中的用戶信息
      setCurrentUser(user);
      setIsAdminAuthenticated(true);
      toast.success("登入成功");
    } catch (error) {
      console.error("登入失敗：", error);
      localStorage.removeItem('authToken');
      setIsAdminAuthenticated(false);
      setCurrentUser(null);
      toast.error(error.message || "登入失敗");
      throw error;
    }
  };

  // 管理員登出
  const adminLogout = () => {
    api.auth.logout()
      .catch(error => console.error("登出時發生錯誤：", error))
      .finally(() => {
        localStorage.removeItem('authToken');
        setIsAdminAuthenticated(false);
        setCurrentUser(null);
        toast.success("已登出");
      });
  };

  const value = {
    isAdminAuthenticated,
    adminLogin,
    adminLogout,
    currentUser,
    isLoading,
  };

  if (isLoading) {
    return null; // 或返回載入中的UI
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
