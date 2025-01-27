"use client"

import React from "react";
import { Button } from "@/components/ui/button"

const formatDate = (dateString) => {
    const date = new Date(dateString)
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const time = date.toTimeString().split(' ')[0]
    return `${month}-${day} ${time}`
}

export default function ReservationCard({ reservation, index, onQualified, onUnqualified, isAdminAuthenticated }) {
    return (
        <div key={index} className="flex flex-col gap-2 w-[300px] border-2 border-gray-300 rounded-lg p-2">
            <div className="flex justify-between items-center">
                <p className="font-bold">{reservation.building}-{reservation.room_number}</p>
                <div className="flex flex-col gap-1">
                    <p>預約時間：{formatDate(reservation.createdAt)}</p>
                    <p>檢查結果：{reservation.status}</p>
                    <p>檢查人員：{reservation.inspector || '尚未檢查'}</p>
                </div>
            </div>

            {isAdminAuthenticated && (
                <div className="flex flex-col gap-2">
                    <div className="border border-gray-300"></div>
                    <div className="flex justify-center gap-12">
                        <Button onClick={() => onUnqualified(index)} className="bg-red-600 hover:bg-red-500">
                            不合格
                        </Button>
                        <Button onClick={() => onQualified(index)} className="bg-green-600 hover:bg-green-500">
                            合格
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}