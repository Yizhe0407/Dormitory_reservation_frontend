"use client"

import * as React from "react"
import { api } from "@/lib/api"
import { useAuth } from "@/contexts/AuthContext"
import ReservationForm from "@/components/ReservationForm"
import ReservationList from "@/components/ReservationList"

export default function Home() {
  const { isAdminAuthenticated, adminLogout, currentUser } = useAuth()
  const [reservationData, setReservationData] = React.useState(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching reservation data...');
        const data = await api.reserve.all();
        console.log('Fetched reservation data:', data);
        setReservationData(data.reserves);
      } catch (error) {
        console.error('Error fetching reservations:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const qualified = async (index) => {
    if (reservationData && reservationData[index] && currentUser) {
      const selectedReservation = reservationData[index];
      const info = {
        building: selectedReservation.building,
        room_number: selectedReservation.room_number,
        username: currentUser.username, // 添加当前用户名称
      };

      setReservationData((prevData) => {
        const newData = [...prevData];
        newData[index] = {
          ...newData[index],
          status: '檢查合格',
          inspector: currentUser.username,    
        };
        return newData;
      });

      try {
        await api.reserve.qualified(info);
      } catch (error) {
        console.error('Error updating reservation status:', error);
      }
    } else {
      console.error('No valid reservation selected or data missing.');
    }
  };

  const unqualified = async (index) => {
    if (reservationData && reservationData[index] && currentUser) {
      const selectedReservation = reservationData[index];
      const info = {
        building: selectedReservation.building,
        room_number: selectedReservation.room_number,
        username: currentUser.username, // 添加当前用户名称
      };

      setReservationData((prevData) => {
        const newData = [...prevData];
        newData[index] = {
          ...newData[index],
          status: '檢查不合格',
          inspector: currentUser.username,
        };
        return newData;
      });

      try {
        await api.reserve.unqualified(info);
      } catch (error) {
        console.error('Error updating reservation status:', error);
      }
    } else {
      console.error('No valid reservation selected or data missing.');
    }
  };

  if (loading) {
    return <p>Loading...</p>
  }

  return (
    <div className="flex flex-col items-center space-y-4 h-screen">
      <ReservationForm />

      <ReservationList
        reservations={reservationData}
        onQualified={qualified}
        onUnqualified={unqualified}
        isAdminAuthenticated={isAdminAuthenticated}
      />

    </div>
  );
}
