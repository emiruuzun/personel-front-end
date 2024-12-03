import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { leaveSave } from "../../../services/leave";
import { profile } from "../../../services/profile";
import DashboardLayout from "../../../layout/DashboardLayout";
import {
  FaCalendarAlt,
  FaCommentAlt,
  FaCheckCircle,
  FaPhoneAlt,
  FaUser,
  FaSpinner,
} from "react-icons/fa";

const LeaveRequestForm = () => {
  const Navigate = useNavigate();
  const [leaveType, setLeaveType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [fullName, setFullName] = useState(""); // Adı Soyadı
  const [position, setPosition] = useState(""); // Pozisyon
  const [periodYear, setPeriodYear] = useState(new Date().getFullYear());
  const [tcNo, setTcNo] = useState(""); // TC No
  const [leaveDays, setLeaveDays] = useState(0);
  const [contactNumber, setContactNumber] = useState(""); // İletişim numarası
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Kullanıcı bilgilerini profile servisi ile çek
    const fetchProfileData = async () => {
      try {
        const response = await profile();
        if (response.success) {
          const userData = response.data;
          setFullName(userData.name);
          setPosition(userData.position);
          setTcNo(userData.tcNo);
          setContactNumber(userData.contact);
        }
      } catch (error) {
        console.error("Kullanıcı bilgileri alınamadı:", error);
      }
    };

    fetchProfileData();
  }, []);

  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)); // Başlangıç ve bitiş günlerini dahil eder
      setLeaveDays(days > 0 ? days : 0); // Negatif sonuçları engellemek için kontrol
    }
  }, [startDate, endDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Gerekli alanların boş olup olmadığını kontrol et
    if (
      !fullName ||
      !position ||
      !periodYear ||
      !tcNo ||
      !leaveType ||
      !startDate ||
      !endDate ||
      !contactNumber ||
      !reason
    ) {
      alert("Lütfen tüm alanları doldurun.");
      return;
    }
    setIsSubmitting(true);
    const leaveData = {
      fullName,
      position,
      periodYear,
      tcNo,
      leaveType,
      startDate,
      endDate,
      leaveDays,
      contactNumber,
      reason,
    };

    try {
      await leaveSave(leaveData, Navigate);
    } catch (error) {
      console.error("İzin talebi gönderilirken hata oluştu:", error);
      alert("İzin talebi gönderilirken bir hata oluştu.");
      setIsSubmitting(false);
    }
  };

  // Sadece sayı girişine izin veren fonksiyon
  const handleNumericInput = (e, setter) => {
    const value = e.target.value;
    if (!isNaN(value)) {
      setter(value);
    }
  };

  // Bugünün tarihini YYYY-MM-DD formatında alın
  const today = new Date().toISOString().split("T")[0];

  // Start Date + 1 day
  const minEndDate = startDate
    ? new Date(new Date(startDate).getTime() + 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0]
    : today;

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto p-4 bg-white shadow-lg rounded-lg">
        <h2 className="text-3xl font-extrabold border-gray-700 pb-4 text-indigo-500 text-center mb-6">
          İzin Talep Formu
        </h2>
        <div className="max-h-[70vh] overflow-y-auto px-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Adı Soyadı */}
            <div className="flex flex-col">
              <label className="mb-2 text-gray-700 flex items-center">
                <FaUser className="mr-2" /> Adı Soyadı:
              </label>
              <input
                type="text"
                value={fullName}
                disabled
                className="p-3 border rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
              />
            </div>

            {/* Görevi */}
            <div className="flex flex-col">
              <label className="mb-2 text-gray-700">Görevi:</label>
              <input
                type="text"
                value={position}
                disabled
                className="p-3 border rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
              />
            </div>

            {/* İzin Ait Olduğu Dönem (YIL) */}
            <div className="flex flex-col">
              <label className="mb-2 text-gray-700">
                İzin Ait Olduğu Dönem (YIL):
              </label>
              <input
                type="number"
                value={periodYear}
                onChange={(e) => handleNumericInput(e, setPeriodYear)}
                required
                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* TC.NO */}
            <div className="flex flex-col">
              <label className="mb-2 text-gray-700">TC NO:</label>
              <input
                type="text"
                value={tcNo}
                disabled
                className="p-3 border rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
              />
            </div>

            {/* İzin Türü */}
            <div className="flex flex-col">
              <label className="mb-2 text-gray-700">İzin Türü:</label>
              <select
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value)}
                required
                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seçin</option>
                <option value="Yıllık İzin">Yıllık İzin</option>
                <option value="Mazeret İzni">Mazeret İzni</option>
                <option value="Ücretsiz İzin">Ücretsiz İzin</option>
                <option value="Raporlu">Raporlu</option>
                <option value="Ücretli İzin">Ücretli İzin</option>
              </select>
            </div>

            {/* Başlangıç ve Bitiş Tarihleri */}
            <div className="flex flex-col">
              <label className="mb-2 text-gray-700">Başlangıç Tarihi:</label>
              <div className="relative">
                <FaCalendarAlt className="absolute top-3 left-3 text-gray-400" />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                  min={today} // Bugünden önceki tarih seçilemez
                  className="pl-10 p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label className="mb-2 text-gray-700">Bitiş Tarihi:</label>
              <div className="relative">
                <FaCalendarAlt className="absolute top-3 left-3 text-gray-400" />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                  min={minEndDate} // Başlangıç tarihinden bir gün sonrası en erken tarih olarak ayarlandı
                  className="pl-10 p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* İzinli Gün Sayısı (Otomatik Hesaplama) */}
            <div className="flex flex-col">
              <label className="mb-2 text-gray-700">İzinli Gün Sayısı:</label>
              <input
                type="number"
                value={leaveDays}
                readOnly
                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100"
              />
            </div>

            {/* İletişim Numarası */}
            <div className="flex flex-col">
              <label className="mb-2 text-gray-700 flex items-center">
                <FaPhoneAlt className="mr-2" /> İletişim Numarası:
              </label>
              <input
                type="tel"
                value={contactNumber}
                disabled
                className="p-3 border rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
              />
            </div>

            {/* İzin Nedeni */}
            <div className="flex flex-col">
              <label className="mb-2 text-gray-700 flex items-center">
                <FaCommentAlt className="mr-2" /> İzin Nedeni:
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
                className="p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex items-center justify-center ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              } text-white py-3 rounded-lg transition duration-300`}
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="mr-2 animate-spin" />
                  Gönderiliyor...
                </>
              ) : (
                <>
                  <FaCheckCircle className="mr-2" />
                  Talep Gönder
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LeaveRequestForm;
