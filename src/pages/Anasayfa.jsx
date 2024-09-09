import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGamepad, FaPen, FaStar } from 'react-icons/fa';
import cyp1 from "../assets/cyp1.png"

function Anasayfa() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/giris');
  };

  return (
    <div 
      className="flex flex-col items-center justify-center h-screen bg-cover bg-center transition-all duration-3000 ease-in-out"
      style={{ backgroundImage: `url(${cyp1})` }}
    >
      <h1 className="text-6xl font-bold text-center mb-8 text-white">
        Oyun Bilgileri
      </h1>
      <p className="text-white text-2xl mb-6">
        En güncel oyun bilgileri ve soruları burada!
      </p>
      <div className="flex space-x-4 mb-8">
        <button className="transform flex items-center space-x-2 bg-white py-2 px-6 rounded-full shadow-lg text-indigo-600 font-semibold hover:bg-gray-100 transition-transform duration-500 hover:scale-105">
          <FaGamepad />
          <span>Bilgilere Gözat</span>
        </button>
        <button className="transform flex items-center space-x-2 bg-indigo-600 py-2 px-6 rounded-full shadow-lg text-white font-semibold hover:bg-indigo-500 transition-transform duration-500 hover:scale-105">
          <FaPen />
          <span>Yeni Bilgi Paylaş</span>
        </button>
      </div>
      <div className="flex flex-col items-center mb-6 space-y-2">
        <FaStar className="text-yellow-400"/>
        <p className="text-white italic">"Bu oyun inanılmaz!" - Merve</p>
      </div>
      <button 
        onClick={handleLoginClick}
        className="transform bg-green-500 py-2 px-6 rounded-full shadow-lg text-white font-semibold hover:bg-green-400 transition-transform duration-500 hover:scale-105">
        Giriş Yap
      </button>
    </div>
  );
}

export default Anasayfa;
