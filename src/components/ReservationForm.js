"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { floorRooms } from "@/lib/roomData"
import BuildingSelect from "./BuildingSelect"
import FloorSelect from "./FloorSelect"
import RoomSelect from "./RoomSelect"
import { toast } from "sonner" 
import { api } from "@/lib/api"

export default function ReservationForm() {
    const [selectedBuilding, setSelectedBuilding] = React.useState("")
    const [selectedFloor, setSelectedFloor] = React.useState("")
    const [selectedRoom, setSelectedRoom] = React.useState("")
    const [roomOptions, setRoomOptions] = React.useState([])

    // 當樓層改變時，更新房號選項
    const handleFloorChange = (floor) => {
        setSelectedFloor(floor)
        setRoomOptions(floorRooms[floor] || [])
        setSelectedRoom("") // 樓層改變時清空房號選擇
    }

    // 處理表單提交
    const handleSubmit = async (e) => {
        //e.preventDefault()

        if (!selectedBuilding || !selectedFloor || !selectedRoom) {
            toast.error("請完整選擇棟別、樓層與房號")
            return
        }

        const reservationData = {
            building: selectedBuilding,
            floor: selectedFloor,
            room_number: selectedRoom,
        }

        try {
            await api.reserve.add(reservationData)
            toast.success("預約成功")
        } catch (error) {
            console.error("預約失敗", error)
            toast.error("預約失敗，請稍後再試")
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col items-center">
            <BuildingSelect onBuildingChange={setSelectedBuilding} />
            <FloorSelect onFloorChange={handleFloorChange} />
            <RoomSelect roomOptions={roomOptions} onRoomChange={setSelectedRoom} />
            <Button className="w-14 m-2" type="submit">
                預約
            </Button>
        </form>
    )
}
