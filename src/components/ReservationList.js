import React from 'react'
import ReservationCard from "./ReservationCard"

export default function ReservationList({ reservations = [], onQualified, onUnqualified, isAdminAuthenticated }) {
    if (!Array.isArray(reservations)) {
        console.error('Reservations prop is not an array:', reservations);
        return <p className="font-bold">載入預約資料時發生錯誤</p>;
    }

    return reservations.length > 0 ? (
        reservations.map((reservation, index) => (
            <ReservationCard
                key={index}
                reservation={reservation}
                index={index}
                onQualified={onQualified}
                onUnqualified={onUnqualified}
                isAdminAuthenticated={isAdminAuthenticated}
            />
        ))
    ) : (
        <p className="font-bold">尚未有人預約</p>
    );
}