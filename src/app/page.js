"use client"

import * as React from "react"
import { api } from "@/lib/api"
import { useAuth } from "@/contexts/AuthContext"
import ReservationForm from "@/components/ReservationForm"
import ReservationList from "@/components/ReservationList"
import { toast } from "sonner"

const REFRESH_INTERVAL = 1 * 60 * 1000; // 1分鐘

export default function Home() {
  const { isAdminAuthenticated, adminLogout, currentUser } = useAuth()
  const [reservationData, setReservationData] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const refreshIntervalRef = React.useRef(null);

  const fetchReservations = React.useCallback(async () => {
    try {
      console.log('Fetching reservation data...');
      const data = await api.reserve.all();
      console.log('Fetched reservation data:', data);
      setReservationData(data.reserves || []);
    } catch (error) {
      console.error('Error fetching reservations:', error);
      toast.error('載入預約資料時發生錯誤');
      setReservationData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // 初始載入和設置定時器
  React.useEffect(() => {
    fetchReservations();

    // 設置定時刷新
    refreshIntervalRef.current = setInterval(() => {
      console.log('Auto-refreshing reservation data...');
      fetchReservations();
    }, REFRESH_INTERVAL);

    // 清理定時器
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [fetchReservations]);

  const qualified = async (index) => {
    if (reservationData && reservationData[index] && currentUser) {
      const selectedReservation = reservationData[index];
      const info = {
        building: selectedReservation.building,
        room_number: selectedReservation.room_number,
        username: currentUser.username
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
        toast.success('已標記為合格');
      } catch (error) {
        console.error('Error updating reservation status:', error);
        toast.error('更新狀態時發生錯誤');
        // 回滾狀態
        setReservationData((prevData) => {
          const newData = [...prevData];
          newData[index] = {
            ...newData[index],
            status: selectedReservation.status,
            inspector: selectedReservation.inspector,
          };
          return newData;
        });
      }
    } else {
      console.error('No valid reservation selected or data missing.');
      toast.error('無效的預約資料');
    }
  };

  const unqualified = async (index) => {
    if (reservationData && reservationData[index] && currentUser) {
      const selectedReservation = reservationData[index];
      const info = {
        building: selectedReservation.building,
        room_number: selectedReservation.room_number,
        username: currentUser.username
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
        toast.success('已標記為不合格');
      } catch (error) {
        console.error('Error updating reservation status:', error);
        toast.error('更新狀態時發生錯誤');
        // 回滾狀態
        setReservationData((prevData) => {
          const newData = [...prevData];
          newData[index] = {
            ...newData[index],
            status: selectedReservation.status,
            inspector: selectedReservation.inspector,
          };
          return newData;
        });
      }
    } else {
      console.error('No valid reservation selected or data missing.');
      toast.error('無效的預約資料');
    }
  };

  if (loading) {
    return <p>Loading...</p>
  }

  return (
    <div className="flex flex-col items-center space-y-4 h-screen">
      <ReservationForm onReservationAdded={fetchReservations} />
      <ReservationList 
        reservations={reservationData} 
        onQualified={qualified}
        onUnqualified={unqualified}
        isAdminAuthenticated={isAdminAuthenticated}
      />
    </div>
  )
}
