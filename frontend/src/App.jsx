import { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';

function App() {
    const [_, setRefresh] = useState(0);
    useEffect(() => {
        const handleStorage = () => setRefresh(prev => prev + 1);
        window.addEventListener("storage", handleStorage);
        return () => window.removeEventListener("storage", handleStorage);
    }, []);

    return (
        <div className="min-h-screen flex flex-col">
            {/* Navbar */}
            <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
                <div>
                    <Link to="/" className="mr-4 cursor-pointer">Accueil</Link>
                    <Link to="/register" className="mr-4 cursor-pointer">Inscription</Link>
                    <Link to="/login" className="cursor-pointer">Connexion</Link>
                </div>
                {localStorage.getItem("username") && (
                    <button
                        onClick={() => {
                            localStorage.clear();
                            window.location.href = "/";
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                    >
                        Se déconnecter
                    </button>
                )}
            </nav>

            {/* Zone centrale */}
            <div className="flex-grow flex items-center justify-center bg-gray-100">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                </Routes>
            </div>
        </div>
    );
}

export default App;