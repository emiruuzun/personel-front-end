import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminDashboardlayout from '../../../layout/AdminDashboard';
import { profile, deleteUser, uploadProfileImage } from '../../../services/profile';
import { getProfileImageUrl } from '../../../utils/profileImgUrl';
import { formatDate } from '../../../utils/form-date';
import * as Dialog from '@radix-ui/react-dialog';

const AdminProfilePage = () => {
  const navigate = useNavigate();
  const [response, setResponse] = useState();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      if (response?.data.role === 'admin') {
        await deleteUser(navigate, email, password);
      } else {
        console.error('Only admins can delete users');
      }
    } catch (error) {
      console.error('Delete failed:', error);
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
      console.error('Resim yükleme başarısız oldu:', error);
    }
  };
  
  
  return (
    <AdminDashboardlayout>
      <div className='w-2/3 bg-gray-800 p-8 rounded-xl mx-auto '>
      <div className="flex justify-between items-stretch">
        <h2 className="text-2xl font-bold text-gray-100">Profile</h2>
        <img
          className="h-[100px] w-[150px] object-cover rounded-lg "
          src={profileImage || getProfileImageUrl(response?.data?.profile_image)}
          alt="Profil"
        />
      </div>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="mb-4">
          <label className="block text-gray-100 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-900 text-gray-400 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            value={response?.data.email || ''}
            type="email"
            placeholder={response?.data.email}
            disabled
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-100 text-sm font-bold mb-2" htmlFor="username">
            User Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-900 text-gray-400 leading-tight focus:outline-none focus:shadow-outline"
            id="username"
            placeholder={response?.data.name}
            type="text"
            disabled
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-100 text-sm font-bold mb-2" htmlFor="role">
            Role
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-900 text-gray-400 leading-tight focus:outline-none focus:shadow-outline"
            id="role"
            placeholder={response?.data.role}
            type="text"
            disabled
          />
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-gray-100 text-sm font-bold mb-2" htmlFor="accounttime">
          Create Account Time
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-900 text-gray-400 leading-tight focus:outline-none focus:shadow-outline"
          id="accounttime"
          placeholder={formattedDate}
          type="text"
          disabled
        />
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
            className="inline-block cursor-pointer bg-gray-900 text-white rounded-lg px-5 py-3 hover:bg-gray-800"
          >
            Change Profile Image
          </label>
        </div>
        <div>
          <Dialog.Root>
            <Dialog.Trigger asChild>
              <button
                className="text-white rounded-lg mt-5 bg-gray-900 px-5 py-3  hover:bg-gray-800"
                onClick={() => setShowDeleteDialog(true)}
              >
                Delete Account
              </button>
            </Dialog.Trigger>
            {showDeleteDialog && (
              <Dialog.Portal>
                <Dialog.Overlay className="bg-blackA9 data-[state=open]:animate-overlayShow fixed inset-0" />
                <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-36%] translate-y-[-50%] rounded-[6px] bg-gray-900 p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
                  <form onSubmit={handleDeleteAccount}>
                    <div className="mb-4">
                      <label className="block text-gray-200 text-sm font-bold mb-2" htmlFor="delete-email">
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
                      <label className="block text-gray-200 text-sm font-bold mb-2" htmlFor="delete-password">
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
                      <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                        Confirm Delete
                      </button>
                      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={() => setShowDeleteDialog(false)}>
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
      </div>
    </AdminDashboardlayout>
  );
};

export default AdminProfilePage;
