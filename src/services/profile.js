import { toast } from "react-toastify";
import { getCookie, deleteCookie } from "../utils/cookie-manager";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL; // API base URL'sini al

export const profile = async () => {
  try {
    const apiRequest = await fetch(`${API_BASE_URL}/auth/profile`, {
      headers: {
        Authorization: `Bearer: ${getCookie("access_token")}`,
      },
      credentials: "include",
    });

    const data = await apiRequest.json();
    return data;
  } catch (error) {
    console.error("API request failed:", error);
    toast.error("Profile retrieval failed");
    throw new Error("API request failed");
  }
};

export const deleteUser = async (navigate, email, password) => {
  try {
    const apiRequest = await fetch(`${API_BASE_URL}/auth/delete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer: ${getCookie("access_token")}`,
      },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });

    const data = await apiRequest.json();
    if (data.success) {
      deleteCookie("access_token");
      toast.success("Success Delete Account", { autoClose: 2000 });
      setTimeout(() => {
        navigate("/kayıt-ol");
      }, 2000);
    } else {
      toast.error(data.message);
    }
    return data;
  } catch (error) {
    console.error("API request failed:", error);
    toast.error("Account delete failed");
    throw new Error("API request failed");
  }
};

export const uploadProfileImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append("profile_image", file);

    const apiRequest = await fetch(`${API_BASE_URL}/auth/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer: ${getCookie("access_token")}`,
      },
      body: formData,
      credentials: "include",
    });

    const data = await apiRequest.json();
    return data;
  } catch (error) {
    console.log(error);
    toast.error("Profile image upload failed");
    throw new Error("Profile image upload failed");
  }
};
