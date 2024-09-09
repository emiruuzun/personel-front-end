import React, { useState } from 'react';
import Button from '../../components/Button';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../../services/auth';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';

function KayıtOl() {
  const navigate = useNavigate();

  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const updateUserNameState = (event) => {
    setUserName(event.target.value);
  };

  const updateEmailState = (event) => {
    setEmail(event.target.value);
  };

  const updatePasswordState = (event) => {
    setPassword(event.target.value);
  };

  const kayitOl = async (event) => {
    event.preventDefault();

    const user = {
      name: userName,
      email: email,
      password: password,
    };

    try {
      const data = await registerUser(user, navigate);
      console.log(data);
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-400 via-indigo-600 to-purple-700">
      <div className="form-container bg-white p-8 w-96 rounded-xl shadow-xl">
        <h1 className="text-3xl font-bold mb-4 text-center text-indigo-500">Kayıt Ol</h1>
        <hr className="my-4" />
        <form className="space-y-6" onSubmit={kayitOl}>
          <div className="flex items-center border-b border-gray-300 py-2">
            <FaUser className="mr-2 text-indigo-500" />
            <input
              type="text"
              onChange={updateUserNameState}
              value={userName}
              placeholder="Kullanıcı Adı"
              className="w-full border-none focus:outline-none"
            />
          </div>
          <div className="flex items-center border-b border-gray-300 py-2">
            <FaEnvelope className="mr-2 text-indigo-500" />
            <input
              type="email"
              onChange={updateEmailState}
              value={email}
              placeholder="E-posta"
              className="w-full border-none focus:outline-none"
            />
          </div>
          <div className="flex items-center border-b border-gray-300 py-2">
            <FaLock className="mr-2 text-indigo-500" />
            <input
              type="password"
              onChange={updatePasswordState}
              value={password}
              placeholder="Şifre"
              className="w-full border-none focus:outline-none"
            />
          </div>

          <p className="text-gray-600 text-center mt-4">
            Hesabın var mı?{' '}
            <Link to="/giris" className="text-indigo-500 hover:underline">
              Buradan Giriş Yap
            </Link>
          </p>

          <Button
            butonName="Kayıt Ol"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded"
          />
        </form>
      </div>
    </div>
  );
}

export default KayıtOl;
