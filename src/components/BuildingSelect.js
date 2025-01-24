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

export default function BuildingSelect({ onBuildingChange }) {
    return (
        <div className="flex justify-center gap-4 items-center m-2">
            <h2 className="font-bold">棟別</h2>
            <Select onValueChange={onBuildingChange}>
                <SelectTrigger className="w-28">
                    <SelectValue placeholder="請選棟別" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectItem value="A1">A1</SelectItem>
                        <SelectItem value="A2">A2</SelectItem>
                        <SelectItem value="A3">A3</SelectItem>
                        <SelectItem value="B1">B1</SelectItem>
                        <SelectItem value="B2">B2</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    )
}
