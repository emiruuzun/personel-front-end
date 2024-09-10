import React, { useState, useEffect } from "react";
import DashboardLayout from "../../../layout/DashboardLayout";
import { feed } from "../../../services/auth";
import { useNotifications } from "../../../context/NotificationContext";
import { io } from "socket.io-client";

function FeedPage() {
  const [announcements, setAnnouncements] = useState([]);
  const { setNotifications } = useNotifications();

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const feedData = await feed();
        setAnnouncements(feedData.data);
        setNotifications([]);
      } catch (error) {
        console.error("Failed to fetch announcements:", error);
      }
    };

    fetchFeed();
  }, [setNotifications]);

  useEffect(() => {
    const socket = io(process.env.REACT_APP_SOCKET_URL);

    socket.on("announcement", (newAnnouncement) => {
      setAnnouncements((prevAnnouncements) => [
        newAnnouncement,
        ...prevAnnouncements,
      ]);
    });

    return () => {
      socket.off("announcement");
    };
  }, []);

  useEffect(() => {
    const socket = io(process.env.REACT_APP_SOCKET_URL);

    return () => {
      socket.off("likeNotification");
    };
  }, []);

  return (
    <DashboardLayout>
      <div className="bg-gray-800 p-4 sm:p-6 rounded-lg overflow-y-auto h-full max-h-[calc(100vh-2rem)]">
        <h2 className="text-xl sm:text-2xl font-bold text-indigo-400 mb-4">
          Admin Duyuruları
        </h2>
        {announcements.length === 0 ? (
          <div className="flex justify-center items-center h-64 text-2xl sm:text-4xl text-indigo-900">
            Admin tarafından henüz hiç duyuru yok.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {announcements.map((announcement) => (
              <div
                key={announcement._id}
                className="bg-gray-900 p-4 rounded-lg shadow-md"
              >
                <h3 className="text-base sm:text-lg font-bold text-indigo-400 mb-2">
                  {announcement.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-200 mb-4">
                  {announcement.content}
                </p>
                <span className="text-xs sm:text-sm text-gray-400 block mb-4">
                  Oluşturma Tarihi:{" "}
                  {new Date(announcement.date).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default FeedPage;