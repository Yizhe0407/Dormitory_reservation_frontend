"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";

// 创建 Context
const AuthContext = createContext(undefined);

// 自定义 Hook，用于消费 AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// AuthProvider 组件
export const AuthProvider = ({ children }) => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false); // 是否为管理员认证
  const [currentUser, setCurrentUser] = useState(null); // 当前用户信息
  const [isLoading, setIsLoading] = useState(true); // 是否在加载

  // 初始化验证
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const user = await api.auth.me(); // 获取当前登录用户信息
        setCurrentUser(user); // 存储用户信息
        setIsAdminAuthenticated(true); // 认证为管理员
      } catch (error) {
        console.error("Error verifying token:", error);
        setIsAdminAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // 验证管理员 Token
  const verifyAdminToken = async () => {
    try {
      const user = await api.auth.me(); // 验证并获取用户信息
      setCurrentUser(user); // 更新用户信息
      return true;
    } catch (error) {
      console.error("Error verifying token:", error);
      return false;
    }
  };

  // 管理员登录
  const adminLogin = (token) => {
    setIsAdminAuthenticated(true); // 设置为已认证
  };

  // 管理员登出
  const adminLogout = async () => {
    try {
      await api.auth.logout(); // 调用登出 API
      setIsAdminAuthenticated(false);
      setCurrentUser(null); // 清除当前用户信息
      toast.success("管理者已登出");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("登出时发生错误");
      // 即使登出失败，仍然在本地完成状态重置
      setIsAdminAuthenticated(false);
      setCurrentUser(null);
    }
  };

  // 如果正在加载，则不渲染内容
  if (isLoading) {
    return null; // 或者返回一个加载状态
  }

  // 提供 Context 值
  return (
    <AuthContext.Provider
      value={{
        isAdminAuthenticated, // 是否认证
        currentUser, // 当前用户信息
        adminLogin, // 登录方法
        adminLogout, // 登出方法
        verifyAdminToken, // 验证 Token 方法
        isLoading, // 加载状态
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
