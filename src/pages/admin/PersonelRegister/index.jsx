import React, { useState } from "react";
import AdminDashboardlayout from "../../../layout/AdminDashboard";
import { registerUser } from "../../../services/admin"; // Servis fonksiyonunu import et

function PersonelRegister() {
  // Her alan için ayrı ayrı state tanımlamaları
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tcNo, setTcNo] = useState("");
  const [position, setPosition] = useState("");
  const [contact, setContact] = useState("");
  const [status, setStatus] = useState("Aktif"); // Varsayılan olarak 'Aktif' ayarladık
  const [group, setGroup] = useState(""); // Group için state

  // Form gönderim fonksiyonu
  const handleSubmit = async (e) => {
    e.preventDefault(); // Sayfanın yeniden yüklenmesini engelle
    const user = {
      name,
      email,
      password,
      tcNo,
      position,
      contact,
      status,
      group, // Group'u ekledik
    };

    try {
      const response = await registerUser(user); // registerUser servis fonksiyonunu çağır
      if (response.success) {
        setName("");
        setEmail("");
        setPassword("");
        setTcNo("");
        setPosition("");
        setContact("");
        setStatus("Aktif"); // Varsayılan olarak 'Aktif' ayarladık
        setGroup(""); // Group alanını sıfırla
      }
    } catch (error) {
      console.error("Kayıt hatası:", error);
    }
  };

  return (
    <AdminDashboardlayout>
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Kullanıcı Kaydet
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              İsim
            </label>
            <input
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Şifre
            </label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              TC No
            </label>
            <input
              type="text"
              name="tcNo"
              value={tcNo}
              onChange={(e) => setTcNo(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              pattern="\d{11}" // Sadece 11 basamaklı sayılar için
              maxLength="11"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pozisyon
            </label>
            <input
              type="text"
              name="position"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              İletişim
            </label>
            <input
              type="tel"
              name="contact"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              pattern="\d+" // Sadece sayılar için
              maxLength={11}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Grup
            </label>
            <select
              name="group"
              value={group}
              onChange={(e) => setGroup(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            >
              <option value="" disabled>
                Grup Seçin
              </option>
              <option value="Mekanik">Mekanik</option>
              <option value="Boru">Boru</option>
              <option value="Elektrik">Elektrik</option>
              <option value="Aksaray">Aksaray</option>
              <option value="Kapı">Kapı</option>
              <option value="Ofis">Ofis</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Durum
            </label>
            <select
              name="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="Aktif">Aktif</option>
              <option value="İzinli">İzinli</option>
              <option value="Pasif">Pasif</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white font-bold rounded-lg"
          >
            Kaydet
          </button>
        </form>
      </div>
    </AdminDashboardlayout>
  );
}

export default PersonelRegister;
