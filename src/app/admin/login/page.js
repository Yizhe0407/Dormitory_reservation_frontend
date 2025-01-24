'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'

export default function Page() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const { adminLogin, isAdminAuthenticated } = useAuth()
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    })

    const handleSubmit = async (e) => {
        e.preventDefault() // 阻止默認表單提交行為（防止頁面刷新）
        setIsLoading(true)

        try {   
            const { token } = await api.auth.login(formData)
            adminLogin(token)
            toast.success('登入成功')
            router.push('/')
        } catch (error) {
            console.error(error)
            toast.error('登入失敗')
        } finally {
            setIsLoading(false)
        }
    }

    // onSubmit={handleSubmit} 事件處理函數，當用戶提交表單時，會執行 handleSubmit 函數
    return (
        <div className="flex items-center justify-center">
            <div className="p-6">
                <h1 className="text-2xl font-bold text-center mb-6">管理者登入</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="username" className="text-sm font-medium">
                            帳號
                        </label>
                        <Input
                            id="username"
                            type="text"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            required
                            disabled={isLoading}
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="password" className="text-sm font-medium">
                            密碼
                        </label>
                        <Input
                            id="password"
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                            disabled={isLoading}
                        />
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? '登入中...' : '登入'}
                    </Button>
                </form>
            </div>
        </div>
    )
}
