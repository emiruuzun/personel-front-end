import React, { useEffect, useState } from 'react';
import AdminDashboardlayout from "../../../layout/AdminDashboard";
import { getAllUsers, deleteUserAdmin, toggleBlockUser } from '../../../services/admin';
import * as Dialog from '@radix-ui/react-dialog';

function GetAllUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await getAllUsers();
                if (response && response.success) {
                    setUsers(response.data);
                }
            } catch (error) {
                console.error("Users could not be fetched.", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const handleDelete = async (userId) => {
        try {
            const response = await deleteUserAdmin(userId);
            if (response && response.success) {
                setUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
            } 
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    const handleShowDelete = (userId) => {
        setUserToDelete(userId);
        setShowDeleteConfirm(true);
    }

    const handleConfirmDelete = async () => {
        if (userToDelete) {
            await handleDelete(userToDelete);
            setShowDeleteConfirm(false);
            setUserToDelete(null);
        }
    }

    const handleCloseDeleteConfirm = () => {
        setShowDeleteConfirm(false);
        setUserToDelete(null);
    }
    

    const handleBlock = async(userId) => {
        try {
            const response = await toggleBlockUser(userId);
            console.log(response.Blok,"blokres");
            if(response && response.success) {
                setUsers(prevUsers => {
                    return prevUsers.map(user => {
                        if(user._id === userId) {
                            return {...user, isBlockedByAdmin: response.Blok};
                        }
                        return user;
                    });
                });
            }
    
            return response;
        } catch(error) {
            console.error(`User with ID: ${userId} could not be blocked. Error:`, error);
        }
    };
    

    const formatDate = (dateString) => {
        if (!dateString) return "Hala Bloklanmadınız :)";
    
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        const formattedDate = new Date(dateString).toLocaleString(undefined, options);
        
        return formattedDate === "Invalid Date" ? "" : formattedDate; 
    }
    

    return (
        <AdminDashboardlayout>
            {loading ? (
                <div className="flex justify-center items-center min-h-screen">
                    <p className="text-xl font-semibold text-gray-700">Loading...</p>
                </div>
            ) : (
                <div className="p-8">
                    <h1 className="text-2xl font-semibold mb-6">User List</h1>
                    <table className="min-w-full bg-white rounded-lg shadow-md">
                        <thead>
                            <tr className="text-left bg-gray-800 text-white rounded-t">
                                <th className="py-3 px-4">Name</th>
                                <th className="py-3 px-4">Email</th>
                                <th className="py-3 px-4">Verification Status</th>
                                <th className="py-3 px-4">Creation Date</th>
                                <th className="py-3 px-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user._id} className="border-t border-gray-200 hover:bg-gray-100 transition duration-150">
                                    <td className="py-3 px-4">{user.name}</td>
                                    <td className="py-3 px-4">{user.email}</td>
                                    <td className="py-3 px-4">
                                        {user.isVerify ? (
                                            <span className="bg-green-200 text-green-700 py-1 px-3 rounded-full text-xs font-semibold">
                                                Verified
                                            </span>
                                        ) : (
                                            <span className="bg-red-200 text-red-700 py-1 px-3 rounded-full text-xs font-semibold">
                                                Not Verified
                                            </span>
                                        )}
                                    </td>
                                    <td className="py-3 px-4">{new Date(user.creatAt).toLocaleDateString()}</td>
                                    <td className="py-3 px-4 flex space-x-2">
                                        
                                        <button 
                                            onClick={() => handleShowDelete(user._id)}
                                            className="bg-red-500 text-white py-1 px-3 rounded text-xs font-semibold hover:bg-red-600 transition duration-150">
                                            Sil
                                        </button>
                                        <button 
                                            onClick={() => handleBlock(user._id)}
                                            className="bg-yellow-500 text-white py-1 px-3 rounded text-xs font-semibold hover:bg-yellow-600 transition duration-150">
                                            Blokla/kaldır
                                        </button>
                                        <button 
                                            onClick={() => setSelectedUser(user)}
                                            className="bg-blue-500 text-white py-1 px-3 rounded text-xs font-semibold hover:bg-blue-600 transition duration-150">
                                            Kullanıcı Bilgileri
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {selectedUser && (
                        <Dialog.Root open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
                            <Dialog.Overlay className="fixed inset-0 bg-black opacity-50" />
                            <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/3 p-6 bg-white rounded shadow-xl">
                                <h2 className="text-lg font-semibold mb-4">User Details</h2>
                                <p><strong>Failed Attempts:</strong> {selectedUser.failedAttempts}</p>
                                <p><strong>Layer:</strong> {selectedUser.layer}</p>
                                <p><strong>blockedUntil:</strong> {formatDate(selectedUser.blockedUntil)}</p>
                                <p><strong>isBlockedByAdmin:</strong> {selectedUser.isBlockedByAdmin ? "Evet":"Hayır"}</p>
                                <button className="mt-4 bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-800" onClick={() => setSelectedUser(null)}>Close</button>
                            </Dialog.Content>
                        </Dialog.Root>
                    )}
                                        {showDeleteConfirm && (
                        <Dialog.Root open={showDeleteConfirm} onOpenChange={handleCloseDeleteConfirm}>
                            <Dialog.Overlay className="fixed inset-0 bg-black opacity-50" />
                            <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/3 p-6 bg-white rounded shadow-xl">
                                <h2 className="text-lg font-semibold mb-4">Kullanıcıyı Sil</h2>
                                <p>Emin misiniz?</p>
                                <div className="flex justify-end space-x-4 mt-4">
                                    <button className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-800" onClick={handleCloseDeleteConfirm}>Hayır</button>
                                    <button className="bg-red-700 text-white px-4 py-2 rounded-md hover:bg-red-800" onClick={handleConfirmDelete}>Evet</button>
                                </div>
                            </Dialog.Content>
                        </Dialog.Root>
                    )}
                </div>
            )}
        </AdminDashboardlayout>
    )
}

export default GetAllUsers;
