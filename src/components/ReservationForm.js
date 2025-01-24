"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { floorRooms } from "@/lib/roomData"
import BuildingSelect from "./BuildingSelect"
import FloorSelect from "./FloorSelect"
import RoomSelect from "./RoomSelect"
import { toast } from "sonner" 
import { api } from "@/lib/api"
import { useRouter } from "next/navigation"

export default function ReservationForm({ onReservationAdded }) {
    const router = useRouter()
    const [selectedBuilding, setSelectedBuilding] = React.useState("")
    const [selectedFloor, setSelectedFloor] = React.useState("")
    const [selectedRoom, setSelectedRoom] = React.useState("")
    const [roomOptions, setRoomOptions] = React.useState([])
    const [isSubmitting, setIsSubmitting] = React.useState(false)

    // 當樓層改變時，更新房號選項
    const handleFloorChange = (floor) => {
        setSelectedFloor(floor)
        setRoomOptions(floorRooms[floor] || [])
        setSelectedRoom("") // 樓層改變時清空房號選擇
    }

    // 處理表單提交
    const handleSubmit = async (e) => {
        e.preventDefault() // 防止表單默認提交行為

        if (!selectedBuilding || !selectedFloor || !selectedRoom) {
            toast.error("請完整選擇棟別、樓層與房號")
            return
        }

        if (isSubmitting) {
            return // 防止重複提交
        }

        const reservationData = {
            building: selectedBuilding,
            floor: selectedFloor,
            room_number: selectedRoom,
        }

        try {
            console.log('Submitting reservation:', reservationData)
            setIsSubmitting(true)
            const response = await api.reserve.add(reservationData)
            console.log('Reservation response:', response)
            toast.success("預約成功")
            
            // 清空表單
            setSelectedBuilding("")
            setSelectedFloor("")
            setSelectedRoom("")
            setRoomOptions([])

            // 通知父組件更新預約列表
            if (onReservationAdded) {
                onReservationAdded()
            }
        } catch (error) {
            console.error("預約失敗", error)
            let errorMessage = "預約失敗"
            if (error.message) {
                errorMessage += `：${error.message}`
            }
            if (error.message === "未找到認證令牌") {
                router.push("/login")
            }
            toast.error(errorMessage)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col items-center">
            <BuildingSelect 
                value={selectedBuilding}
                onBuildingChange={setSelectedBuilding} 
            />
            <FloorSelect 
                value={selectedFloor}
                onFloorChange={handleFloorChange} 
            />
            <RoomSelect 
                value={selectedRoom}
                roomOptions={roomOptions} 
                onRoomChange={setSelectedRoom} 
            />
            <Button 
                className="w-14 m-2" 
                type="submit"
                disabled={isSubmitting}
            >
                {isSubmitting ? '提交中...' : '預約'}
            </Button>
        </form>
    )
}
