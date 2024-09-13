import { toast } from "react-toastify";
import { getCookie } from "../utils/cookie-manager";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL; // API base URL'sini al
export const registerUser = async (user) => {
  try {
    const apiRequest = await fetch(`${API_BASE_URL}/admin/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer: ${getCookie("access_token")}`,
      },
      body: JSON.stringify(user),
    });

    const data = await apiRequest.json();
    if (data.success) {
      toast.success("Registration successful", { autoClose: 2000 });
    } else {
      toast.error(data.message);
    }
    return data;
  } catch (error) {
    console.error("API request failed:", error);
    toast.error("Registration failed");
    throw new Error("API request failed");
  }
};
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
    const response = await apiRequest.json();

    // Yanıtın boş olup olmadığını kontrol et
    if (!response.success || response.data.length === 0) {
      toast.info("Henüz herhangi bir izin talebi bulunmuyor.");
    }
    return response;
  } catch (error) {
    console.error("Talepleri çekerken hata oluştu.", error);
    throw error;
  }
};

export const updateLeaveStatus = async (
  leaveId,
  newStatus,
  rejectionReason
) => {
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
          rejectionReason:
            newStatus === "Reddedildi" ? rejectionReason : undefined, // Reddetme nedeni, sadece durum "Reddedildi" ise gönderilecek
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

export const companyRegister = async (company) => {
  try {
    const apiRequest = await fetch(`${API_BASE_URL}/admin/company-register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer: ${getCookie("access_token")}`,
      },
      body: JSON.stringify(company),
    });

    const data = await apiRequest.json();
    if (data.success) {
      toast.success("Şirket başarıyla kaydedildi!", { autoClose: 2000 });
    } else {
      toast.error(data.message);
    }
    return data;
  } catch (error) {
    console.error("API request failed:", error);
    toast.error("Registration failed");
    throw new Error("API request failed");
  }
};
export const getAllCompanies = async () => {
  try {
    const apiRequest = await fetch(`${API_BASE_URL}/admin/company-gelAll`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer: ${getCookie("access_token")}`,
      },
    });

    const data = await apiRequest.json();

    if (apiRequest.ok) {
      toast.success("Firmalar başarıyla alındı!", { autoClose: 2000 });
    } else {
      toast.error(data.message || "Firmalar alınamadı.");
    }
    return data;
  } catch (error) {
    console.error("API request failed:", error);
    toast.error("Firmalar alınamadı.");
    throw new Error("API request failed");
  }
};

export const addDailyWorkRecord = async (recordData) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/admin/daily-work-record/add`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer: ${getCookie("access_token")}`,
        },
        body: JSON.stringify(recordData),
      }
    );

    const data = await response.json();

    if (response.ok && data.success) {
      toast.success("Günlük iş kaydı başarıyla eklendi!", { autoClose: 2000 });
    } else {
      toast.error(data.message || "Günlük iş kaydı eklenemedi.");
    }

    return data;
  } catch (error) {
    console.error("API isteği başarısız oldu:", error);
    toast.error("Günlük iş kaydı eklenemedi.");
    throw new Error("API request failed");
  }
};

export const updateDailyWorkRecord = async (recordId, updateData) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/admin/daily-work-record/update/${recordId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer: ${getCookie("access_token")}`,
        },
        body: JSON.stringify(updateData),
      }
    );

    const data = await response.json();

    if (response.ok && data.success) {
      toast.success("Günlük iş kaydı başarıyla güncellendi!", {
        autoClose: 2000,
      });
      return data.data;
    } else {
      toast.error(data.message || "Günlük iş kaydı güncellenemedi.");
      return null;
    }
  } catch (error) {
    console.error("API isteği başarısız oldu:", error);
    toast.error("Günlük iş kaydı güncellenemedi.");
    throw new Error("API request failed");
  }
};
