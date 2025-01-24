import React from 'react'
import ReservationCard from "./ReservationCard"

export default function ReservationList({ reservations, onQualified, onUnqualified, isAdminAuthenticated }) {
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
