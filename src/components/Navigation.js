"use client"

import React from 'react'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"

export default function Navigation() {
    const { isAdminAuthenticated, adminLogout } = useAuth()

    const handleLogout = () => {
        adminLogout()
    }

    return (
        <div className="flex justify-between gap-4 items-center my-2 mx-6">
            <h1 className="text-xl font-bold">退宿預約系統</h1>
            <Button asChild>
                {isAdminAuthenticated ? (
                    <Link href="/" onClick={handleLogout}>登出</Link>
                ) : (
                    <Link href="/admin/login">登入</Link>
                )}
            </Button>
        </div>
    )
}
