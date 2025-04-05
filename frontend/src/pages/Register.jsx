import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState(""); // "success" ou "error"
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        // Validation de base côté client
        if (password !== confirmPassword) {
            setMessageType("error");
            setMessage("Les mots de passe ne correspondent pas.");
            return;
        }

        if (password.length < 2) {
            setMessageType("error");
            setMessage("Le mot de passe doit contenir au moins 2 caractères.");
            return;
        }

        setIsLoading(true);
        setMessage("");

        try {
            // ✅ Envoi au backend
            const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/register`, {
                username,
                password,
            });

            setMessageType("success");
            setMessage(res.data.message);

            // ✅ Si succès, envoi à l'extension
            window.postMessage({
                source: "sovrizon-frontend",
                from: "frontend",
                action: "register_user",
                data: { username }
            }, "*");
            console.log("📤 Message envoyé à l'extension :", username);

            // Redirection après un court délai
            setTimeout(() => {
                navigate("/login");
            }, 2000);

        } catch (err) {
            setMessageType("error");
            setMessage(err.response?.data?.detail || "Erreur lors de l'inscription. Veuillez réessayer.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen px-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="bg-centrale py-6">
                        <h2 className="text-2xl font-bold text-center text-white">
                            Créer un compte
                        </h2>
                    </div>

                    <div className="p-8">
                        {message && (
                            <div className={`mb-6 p-3 rounded text-sm ${
                                messageType === "success"
                                    ? "bg-green-50 text-green-800 border border-green-200"
                                    : "bg-red-50 text-red-800 border border-red-200"
                            }`}>
                                {message}
                            </div>
                        )}

                        <form onSubmit={handleRegister} className="space-y-6">
                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                                    Nom d'utilisateur
                                </label>
                                <input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="form-input w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-centrale focus:border-centrale"
                                    required
                                    autoComplete="username"
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                    Mot de passe
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="form-input w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-centrale focus:border-centrale"
                                    required
                                    autoComplete="new-password"
                                />
                            </div>

                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                    Confirmer le mot de passe
                                </label>
                                <input
                                    id="confirmPassword"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="form-input w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-centrale focus:border-centrale"
                                    required
                                    autoComplete="new-password"
                                />
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-centrale hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-centrale transition-colors duration-200"
                                >
                                    {isLoading ? (
                                        <span className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Inscription en cours...
                                        </span>
                                    ) : "S'inscrire"}
                                </button>
                            </div>
                        </form>

                        <p className="mt-6 text-center text-sm text-gray-600">
                            Vous avez déjà un compte ?{" "}
                            <Link to="/login" className="font-medium text-centrale hover:underline">
                                Se connecter
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;