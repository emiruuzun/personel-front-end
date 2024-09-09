import React, { createContext, useState, useContext } from 'react';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [likeNotifications, setLikeNotifications] = useState([]);

  return (
    <NotificationContext.Provider value={{ notifications, setNotifications ,likeNotifications,setLikeNotifications}}>
      {children}
    </NotificationContext.Provider>
  );
};
