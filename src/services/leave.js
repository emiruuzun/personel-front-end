import { toast } from "react-toastify";
import { getCookie } from "../utils/cookie-manager";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL; // API base URL'sini al

export const leaveSave = async (leaveData, navigate) => {
  try {
    const apiRequest = await fetch(`${API_BASE_URL}/leave/save`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer: ${getCookie("access_token")}`,
      },
      body: JSON.stringify(leaveData),
    });

    const data = await apiRequest.json();
    if (data.success) {
      toast.success("Save successful", { autoClose: 2000 });
      setTimeout(() => {
        navigate("/dashboard");
      }, 3000);
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
export const leaveGet = async () => {
  try {
    const apiRequest = await fetch(`${API_BASE_URL}/leave/leave-get`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer: ${getCookie("access_token")}`,
      },
    });

    const data = await apiRequest.json();
    console.log(data,"Dara");

    if (data.success) {
      toast.success("İzin talepleri başarıyla alındı.", { autoClose: 2000 });
    } else {
      toast.error(data.message || "Bir hata oluştu.");
    }

    return data;
  } catch (error) {
    console.error("API request failed:", error);
    toast.error("İzin talepleri alınırken bir hata oluştu.");
    throw new Error("API request failed");
  }
};
