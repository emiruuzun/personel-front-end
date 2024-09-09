import { toast } from "react-toastify";
import { getCookie } from "../utils/cookie-manager";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL; // API base URL'sini al

export const getAllUsers = async () => {
  try {
    const apiRequest = await fetch(`${API_BASE_URL}/admin/alluser`, {
      method: "GET",
      headers: {
        Authorization: `Bearer: ${getCookie("access_token")}`,
      },
    });

    if (!apiRequest.ok) {
      const textResponse = await apiRequest.text();
      console.error("API error response:", textResponse);
      throw new Error(`API request failed with status ${apiRequest.status}`);
    }

    const response = await apiRequest.json();
    return response;
  } catch (error) {
    console.error("Kullanıcıları çekerken hata oluştu.", error);
    throw error;
  }
};

export const deleteUserAdmin = async (userId) => {
  try {
    const apiRequest = await fetch(
      `${API_BASE_URL}/admin/deleteUserAdmin/${userId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer: ${getCookie("access_token")}`,
        },
      }
    );

    const response = await apiRequest.json();

    if (!apiRequest.ok) {
      toast.error(`Hata: ${response.message}`);
    } else {
      toast.success("Kullanıcı başarıyla silindi!");
    }

    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const toggleBlockUser = async (userId) => {
  try {
    const apiRequest = await fetch(`${API_BASE_URL}/admin/blokUser/${userId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer: ${getCookie("access_token")}`,
      },
    });

    const response = await apiRequest.json();
    console.log(response.Blok);

    if (!apiRequest.ok) {
      toast.error(`Hata: ${response.message}`);
    } else {
      if (response.Blok) {
        toast.success("Kullanıcı başarıyla Bloklandı!");
      } else {
        toast.success("Kullanıcının Bloku başarıyla kaldırıldı!");
      }
    }

    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const announcement = async (announcementModel) => {
  const { title, content } = announcementModel;
  try {
    const apiRequest = await fetch(`${API_BASE_URL}/admin/announcement`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer: ${getCookie("access_token")}`,
      },
      body: JSON.stringify({
        title,
        content,
      }),
      credentials: "include",
    });

    const response = await apiRequest.json();

    if (apiRequest.ok) {
      toast.success("Announcement added successfully!");
    } else {
      toast.error(
        `Error: ${response.message || "Failed to add announcement."}`
      );
    }

    return response;
  } catch (error) {
    console.error(error);
    toast.error(`Error: ${error.message || "Failed to add announcement."}`);
    throw error;
  }
};
export const getAllLeave = async () => {
  try {
    const apiRequest = await fetch(`${API_BASE_URL}/admin/leave/getAllleave`, {
      method: "GET",
      headers: {
        Authorization: `Bearer: ${getCookie("access_token")}`,
      },
    });

    if (!apiRequest.ok) {
      const textResponse = await apiRequest.text();
      toast.error("API error response:", textResponse);
      throw new Error(`API request failed with status ${apiRequest.status}`);
    }

    const response = await apiRequest.json();
    return response;
  } catch (error) {
    console.error("Talepleri çekerken hata oluştu.", error);
    throw error;
  }
};

export const updateLeaveStatus = async (leaveId, newStatus) => {
  try {
    const apiRequest = await fetch(
      `${API_BASE_URL}/admin/leave/status-update`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // JSON verisi gönderildiği için Content-Type header'ı eklenmelidir
          Authorization: `Bearer: ${getCookie("access_token")}`,
        },
        body: JSON.stringify({
          leaveId, // İzin talebinin ID'si
          status: newStatus, // Yeni durum
        }),
      }
    );

    if (!apiRequest.ok) {
      const textResponse = await apiRequest.text();
      toast.error(`API error response: ${textResponse}`);
      throw new Error(`API request failed with status ${apiRequest.status}`);
    }

    const response = await apiRequest.json();
    toast.success("İzin durumu başarıyla güncellendi."); // Başarılı mesajı ekleyelim
    return response;
  } catch (error) {
    console.error("Durum güncellenirken hata oluştu.", error);
    toast.error("Durum güncellenirken bir hata oluştu.");
    throw error;
  }
};
