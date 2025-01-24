"use client"

import * as React from "react"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export default function RoomSelect({ roomOptions, onRoomChange }) {
    return (
        <div className="flex justify-center gap-4 items-center m-2">
            <h2 className="font-bold">房號</h2>
            <Select onValueChange={onRoomChange}>
                <SelectTrigger className="w-28">
                    <SelectValue placeholder="請選房號" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        {roomOptions.map((room, index) => (
                            <SelectItem key={index} value={room}>
                                {room}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    )
}
