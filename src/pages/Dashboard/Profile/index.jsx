import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../../layout/DashboardLayout";
import {
  profile,
  deleteUser,
  uploadProfileImage,
} from "../../../services/profile";
import { getProfileImageUrl } from "../../../utils/profileImgUrl";
import { formatDate } from "../../../utils/form-date";
import * as Dialog from "@radix-ui/react-dialog";
import {
  MdEmail,
  MdPerson,
  MdLayers,
  MdSchedule,
  MdEdit,
  MdCloudUpload,
  MdDeleteForever,
  MdPhone,
  MdInfo,
} from "react-icons/md";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [response, setResponse] = useState();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await profile();
      setResponse(res);
    };

    fetchData();
  }, []);

  const formattedDate = formatDate(response?.data.creatAt);

  const handleDeleteAccount = async (event) => {
    event.preventDefault();
    try {
      await deleteUser(navigate, email, password);
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleProfileImageChange = async (event) => {
    const file = event.target.files[0];
    try {
      const res = await uploadProfileImage(file);
      if (res.success) {
        const profileImageUrl = getProfileImageUrl(res.data.profile_image);
        setProfileImage(profileImageUrl);
      } else {
        throw new Error(res.message);
      }
    } catch (error) {
      console.error("Image upload failed:", error);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold text-gray-100">Profile</h2>
          <MdEdit className="text-xl text-gray-300 hover:text-gray-500 cursor-pointer" />
        </div>
        <img
          className="h-[100px] w-[100px] object-cover rounded-full"
          src={
            profileImage || getProfileImageUrl(response?.data?.profile_image)
          }
          alt="Profil"
        />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Email */}
        <div className="mb-4">
          <label
            className="block text-gray-100 text-sm font-bold mb-2"
            htmlFor="email"
          >
            <MdEmail className="inline-block mr-2" /> Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-900 text-gray-400 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            value={response?.data.email || ""}
            type="email"
            placeholder={response?.data.email}
            disabled
          />
        </div>

        {/* Name */}
        <div className="mb-4">
          <label
            className="block text-gray-100 text-sm font-bold mb-2"
            htmlFor="username"
          >
            <MdPerson className="inline-block mr-2" /> User Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-900 text-gray-400 leading-tight focus:outline-none focus:shadow-outline"
            id="username"
            value={response?.data.name || ""}
            placeholder={response?.data.name}
            type="text"
            disabled
          />
        </div>

        {/* Contact (Telefon Numarası) */}
        <div className="mb-4">
          <label
            className="block text-gray-100 text-sm font-bold mb-2"
            htmlFor="contact"
          >
            <MdPhone className="inline-block mr-2" /> Contact (Telefon)
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-900 text-gray-400 leading-tight focus:outline-none focus:shadow-outline"
            id="contact"
            value={response?.data.contact || ""}
            placeholder={response?.data.contact}
            type="text"
            disabled
          />
        </div>

        {/* Position */}
        <div className="mb-4">
          <label
            className="block text-gray-100 text-sm font-bold mb-2"
            htmlFor="position"
          >
            <MdInfo className="inline-block mr-2" /> Position
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-900 text-gray-400 leading-tight focus:outline-none focus:shadow-outline"
            id="position"
            value={response?.data.position || ""}
            placeholder={response?.data.position}
            type="text"
            disabled
          />
        </div>

        {/* TC No */}
        <div className="mb-4">
          <label
            className="block text-gray-100 text-sm font-bold mb-2"
            htmlFor="tcNo"
          >
            <MdInfo className="inline-block mr-2" /> TC No
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-900 text-gray-400 leading-tight focus:outline-none focus:shadow-outline"
            id="tcNo"
            value={response?.data.tcNo || ""}
            placeholder={response?.data.tcNo}
            type="text"
            disabled
          />
        </div>

        {/* Role */}
        <div className="mb-4">
          <label
            className="block text-gray-100 text-sm font-bold mb-2"
            htmlFor="role"
          >
            <MdLayers className="inline-block mr-2" /> Role
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-900 text-gray-400 leading-tight focus:outline-none focus:shadow-outline"
            id="role"
            value={response?.data.role || ""}
            placeholder={response?.data.role}
            type="text"
            disabled
          />
        </div>

        {/* Status */}
        <div className="mb-4">
          <label
            className="block text-gray-100 text-sm font-bold mb-2"
            htmlFor="status"
          >
            <MdInfo className="inline-block mr-2" /> Status
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-900 text-gray-400 leading-tight focus:outline-none focus:shadow-outline"
            id="status"
            value={response?.data.status || ""}
            placeholder={response?.data.status}
            type="text"
            disabled
          />
        </div>

        {/* Account Creation Date */}
        <div className="mb-4">
          <label
            className="block text-gray-100 text-sm font-bold mb-2"
            htmlFor="accounttime"
          >
            <MdSchedule className="inline-block mr-2" /> Create Account Time
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-900 text-gray-400 leading-tight focus:outline-none focus:shadow-outline"
            id="accounttime"
            value={formattedDate}
            placeholder={formattedDate}
            type="text"
            disabled
          />
        </div>
      </div>

      <div className="flex justify-between align-center">
        <div className="mt-5">
          <input
            className="hidden"
            id="profileImage"
            type="file"
            accept="image/*"
            onChange={handleProfileImageChange}
          />
          <label
            htmlFor="profileImage"
            className="inline-flex items-center space-x-2 cursor-pointer bg-gray-900 text-white rounded-lg px-5 py-3 hover:bg-gray-800"
          >
            <MdCloudUpload className="text-xl" />
            <span>Change Profile Image</span>
          </label>
        </div>
        <div>
          <Dialog.Root>
            <Dialog.Trigger asChild>
              <button
                className="inline-flex items-center space-x-2 text-white rounded-lg mt-5 bg-gray-900 px-5 py-3 hover:bg-gray-800"
                onClick={() => setShowDeleteDialog(true)}
              >
                <MdDeleteForever className="text-xl" />
                <span>Delete Account</span>
              </button>
            </Dialog.Trigger>
            {showDeleteDialog && (
              <Dialog.Portal>
                <Dialog.Overlay className="bg-blackA9 data-[state=open]:animate-overlayShow fixed inset-0" />
                <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-36%] translate-y-[-50%] rounded-[6px] bg-gray-900 p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
                  <form onSubmit={handleDeleteAccount}>
                    <div className="mb-4">
                      <label
                        className="block text-gray-200 text-sm font-bold mb-2"
                        htmlFor="delete-email"
                      >
                        Email
                      </label>
                      <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-900 text-gray-100 leading-tight focus:outline-none focus:shadow-outline"
                        id="delete-email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        className="block text-gray-200 text-sm font-bold mb-2"
                        htmlFor="delete-password"
                      >
                        Password
                      </label>
                      <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-900 text-gray-100 leading-tight focus:outline-none focus:shadow-outline"
                        id="delete-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        placeholder="Enter your password"
                        required
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <button
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="submit"
                      >
                        Delete Account
                      </button>
                      <button
                        className="text-gray-400 hover:text-gray-500"
                        onClick={() => setShowDeleteDialog(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </Dialog.Content>
              </Dialog.Portal>
            )}
          </Dialog.Root>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
