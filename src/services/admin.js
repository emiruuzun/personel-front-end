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
export const getDailyWorkRecords = async (date) => {
  console.log(date); // Tarih formatını kontrol edin
  try {
    let formattedDate = "";

    if (date.includes(".")) {
      // Eğer tarih "DD.MM.YYYY" formatındaysa
      const [day, month, year] = date.split(".");
      formattedDate = `${year}-${month}-${day}`; // "YYYY-MM-DD" formatına çevir
    } else if (date.includes("-")) {
      // Eğer tarih "YYYY-MM-DD" formatındaysa
      formattedDate = date; // Zaten doğru formatta
    } else {
      console.error(
        "Invalid date format. Expected format: DD.MM.YYYY or YYYY-MM-DD"
      );
      return { success: false, message: "Geçersiz tarih formatı." };
    }

    const response = await fetch(
      `${API_BASE_URL}/admin/daily-work-records?date=${formattedDate}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer: ${getCookie("access_token")}`,
        },
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching daily work records:", error);
    return { success: false, message: "Kayıt alınamadı." };
  }
};
export const deleteDailyWorkRecord = async (id) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/admin/daily-work-record/delete/${id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer: ${getCookie("access_token")}`, // Auth token ekle
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      toast.error(data.message || "Günlük iş kaydı silinemedi.");
      throw new Error(data.message || "Günlük iş kaydı silinemedi.");
    }

    // Başarılı silme mesajı
    toast.success("Günlük iş kaydı başarıyla silindi.");
    return data;
  } catch (error) {
    console.error("Günlük iş kaydı silinirken hata oluştu:", error);
    throw error;
  }
};
export const getWorkRecordsByDateRange = async (startDate, endDate) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/admin/work-records-by-date-range?startDate=${startDate}&endDate=${endDate}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer: ${getCookie("access_token")}`,
        },
      }
    );

    const data = await response.json();

    if (response.ok && data.success) {
      toast.success("İş kayıtları başarıyla alındı!", { autoClose: 2000 });
      return data.data;
    } else {
      toast.error(data.message || "İş kayıtları alınamadı.");
      return null;
    }
  } catch (error) {
    console.error("API isteği başarısız oldu:", error);
    toast.error("İş kayıtları alınamadı.");
    throw new Error("API request failed");
  }
};
export const getLastLeaveByUserId = async (userId) => {
  try {
    const apiRequest = await fetch(`${API_BASE_URL}/admin/leaves/last`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer: ${getCookie("access_token")}`,
      },
      body: JSON.stringify({ userId }), // req.body ile userId gönderilir
    });

    const response = await apiRequest.json();

    // // Yanıtın boş olup olmadığını kontrol et
    // if (!response.success || !response.data) {
    //   toast.info("Bu kullanıcıya ait herhangi bir izin talebi bulunmuyor.");
    // }
    return response;
  } catch (error) {
    console.error("Kullanıcı izinlerini çekerken hata oluştu.", error);
    throw error;
  }
};
export const deleteCompany = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/company/delete/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer: ${getCookie("access_token")}`,
      },
    });

    return await response.json();
  } catch (error) {
    console.error("Error deleting company:", error);
    throw error;
  }
};
export const addJobToCompany = async (companyId, jobData) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/admin/company/${companyId}/jobs`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer: ${getCookie("access_token")}`,
        },
        body: JSON.stringify(jobData),
      }
    );

    return await response.json();
  } catch (error) {
    console.error("Error adding job to company:", error);
    throw error;
  }
};

export const getJobsByCompanyId = async (companyId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/admin/company/${companyId}/jobsAd`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer: ${getCookie("access_token")}`,
        },
      }
    );

    return await response.json();
  } catch (error) {
    console.error("Error fetching jobs:", error);
    throw error;
  }
};

export const completeJob = async (companyId, jobId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/admin/company/${companyId}/${jobId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer: ${getCookie("access_token")}`,
        },
      }
    );

    const data = await response.json();
    console.log(data);

    if (data && data.success) {
      toast.success("İş başarıyla tamamlandı!");
      // İşi tamamlananlar arasında işaretlemek veya durumu güncellemek için gerekli işlemler
    } else {
      toast.error("İşi tamamlama sırasında bir hata oluştu.");
    }
  } catch (error) {
    console.error("İş tamamlama sırasında hata:", error);
    toast.error("İşi tamamlama sırasında bir hata oluştu.");
  }
};

export const getAllJobsByCompanies = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/company/get-all-jobs`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer: ${getCookie("access_token")}`,
      },
    });

    const data = await response.json();

    if (data.success) {
      toast.success("Tüm iş kayıtları başarıyla alındı!", { autoClose: 2000 });
      return data;
    } else {
      toast.error(data.message || "İş kayıtları alınamadı.");
      return null;
    }
  } catch (error) {
    console.error("API isteği başarısız oldu:", error);
    toast.error("İş kayıtları alınamadı.");
    throw new Error("API request failed");
  }
};

export const getRecentActivities = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/activities/recent`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer: ${getCookie("access_token")}`,
      },
    });

    const data = await response.json();

    if (response.ok && data.success) {
      // Başarılı istek
      return data.activities; // Aktivite verilerini döndür
    } else {
      // Başarısız istek
      toast.error(data.message || "Aktiviteler alınamadı.");
      return null;
    }
  } catch (error) {
    console.error("API isteği başarısız oldu:", error);
    toast.error("Aktiviteler alınamadı.");
    throw new Error("API request failed");
  }
};

export const fetchMonthlyReport = async (month, year) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/admin/monthly-report?month=${month}&year=${year}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer: ${getCookie("access_token")}`,
        },
      }
    );
    const data = await response.json();

    if (data.success) {
      // Başarılı sonuçlarda başarı mesajı gösterebiliriz
      toast.success("Aylık rapor başarıyla alındı.", { autoClose: 2000 });
      console.log("Aylık Rapor Verileri:", data.data);
      return data.data; // Veriyi döndürmek istersen
    } else {
      // Hata durumunda hata mesajı gösterebiliriz
      toast.error(data.message || "Rapor alınamadı.");
      console.error("Rapor alınamadı:", data.message);
    }
  } catch (error) {
    // Genel bir hata mesajı gösterebiliriz
    toast.error("API hatası: Rapor alınamadı.");
    console.error("API hatası:", error);
  }
};
