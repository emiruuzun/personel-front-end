import React, { useState } from 'react';
import AdminDashboardlayout from '../../../layout/AdminDashboard';
import { announcement } from '../../../services/admin';


function AnnouncementPage () {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // Form gönderildiğinde ne olacağını burada işleyeceksiniz.
  // Şu an için bir placeholder fonksiyon olarak duruyor.
  const handleAnnouncementSubmit = async (e) => {
    e.preventDefault();

    try {
      // `announcement` servis fonksiyonunu çağırarak form verilerini gönder
      await announcement({ title, content });
      // Formu temizle
      setTitle('');
      setContent('');
    } catch (error) {
      // Hata durumunda kullanıcıyı bilgilendir
     console.log(error)
    }
  };

  return (
    <AdminDashboardlayout>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Duyuru Yap</h1>
        <form onSubmit={handleAnnouncementSubmit}>
          <div className="mb-4">
            <label htmlFor="announcementTitle" className="block text-sm font-bold mb-2">
              Başlık
            </label>
            <input
              type="text"
              id="announcementTitle"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="announcementContent" className="block text-sm font-bold mb-2">
              İçerik
            </label>
            <textarea
              id="announcementContent"
              rows="4"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Duyuru Gönder
            </button>
          </div>
        </form>
      </div>
    </AdminDashboardlayout>
  );
}

export default AnnouncementPage;
