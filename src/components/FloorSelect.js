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

export default function FloorSelect({ onFloorChange }) {
    return (
        <div className="flex justify-center gap-4 items-center m-2">
            <h2 className="font-bold">樓層</h2>
            <Select onValueChange={onFloorChange}>
                <SelectTrigger className="w-28">
                    <SelectValue placeholder="請選樓層" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectItem value="1floor">1</SelectItem>
                        <SelectItem value="2floor">2</SelectItem>
                        <SelectItem value="3floor">3</SelectItem>
                        <SelectItem value="4floor">4</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    )
}
