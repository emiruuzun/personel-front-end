import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import { loginUser } from '../../services/auth';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { useUser } from "../../context/UserContext"

function Giris() {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const updateEmailState = (event) => {
    setEmail(event.target.value);
  };

  const updatePasswordState = (event) => {
    setPassword(event.target.value);
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    const user = {
      email: email,
      password: password,
    };

    try {
      const response = await loginUser(user,navigate);
      setUser(response.data);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-400 via-indigo-600 to-purple-700">
      <div className="form-container bg-white p-8 w-96 rounded-xl shadow-xl">
        <h1 className="text-3xl font-bold mb-4 text-center text-indigo-500">Giriş Yap</h1>
        <hr className="my-4" />
        <form className="space-y-6" onSubmit={handleLogin}>
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
            Hesabın yok mu?{' '}
            <Link to="/kayıt-ol" className="text-indigo-500 hover:underline">
              Buradan Kayıt ol
            </Link>
          </p>

          <Button
            butonName="Giriş Yap"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded"
          />
        </form>
      </div>
    </div>
  );
}

export default Giris;
