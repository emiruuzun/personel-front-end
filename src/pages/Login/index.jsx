import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import { loginUser } from "../../services/auth";
import { FaEnvelope, FaLock, FaUserCircle } from "react-icons/fa";
import { useUser } from "../../context/UserContext";
import { motion } from "framer-motion";

function Giris() {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
      const response = await loginUser(user, navigate);
      setUser(response.data);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 via-indigo-600 to-purple-700 p-4">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="form-container bg-white p-8 w-full max-w-md rounded-xl shadow-2xl relative overflow-hidden"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            delay: 0.2,
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
          className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500 rounded-full opacity-10"
        />
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            delay: 0.3,
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
          className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500 rounded-full opacity-10"
        />
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-8 text-center"
        >
          <FaUserCircle className="mx-auto text-6xl text-indigo-500" />
          <h1 className="text-3xl font-bold mt-4 text-indigo-700">Giriş Yap</h1>
        </motion.div>
        <form className="space-y-6" onSubmit={handleLogin}>
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="relative"
          >
            <FaEnvelope className="absolute top-3 left-3 text-indigo-500" />
            <input
              type="email"
              onChange={updateEmailState}
              value={email}
              placeholder="E-posta"
              className="w-full pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500"
            />
          </motion.div>
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="relative"
          >
            <FaLock className="absolute top-3 left-3 text-indigo-500" />
            <input
              type="password"
              onChange={updatePasswordState}
              value={password}
              placeholder="Şifre"
              className="w-full pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-indigo-500"
            />
          </motion.div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <Button
              butonName="Giriş Yap"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
            />
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
}

export default Giris;
