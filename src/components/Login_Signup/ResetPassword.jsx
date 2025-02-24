import React, { useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [novaSenha, setNovaSenha] = useState("");
  const [mensagem, setMensagem] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/redefinir-senha", { token, novaSenha });
      setMensagem(response.data.message);
    } catch (error) {
      setMensagem(error.response?.data?.message || "Ocorreu um erro. Tente novamente.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-orange-400 to-orange-600 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 space-y-8">
        <h2 className="text-2xl font-bold text-center">Redefinir Senha</h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Nova Senha</label>
            <input
              type="password"
              placeholder="Nova senha"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-orange-500 text-white font-semibold py-3 rounded-lg hover:bg-orange-600 transition-all duration-200 transform hover:scale-105"
          >
            Redefinir Senha
          </button>
        </form>
        {mensagem && <p className="text-center text-sm text-gray-600">{mensagem}</p>}
      </div>
    </div>
  );
};

export default ResetPassword;