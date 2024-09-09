import React, { createContext, useState, useContext } from "react";

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [leaveNotifications, setLeaveNotifications] = useState([]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        setNotifications,
        leaveNotifications,
        setLeaveNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
