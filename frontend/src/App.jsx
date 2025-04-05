import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';

function App() {
    const [_, setRefresh] = useState(0);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();
    const isLoggedIn = localStorage.getItem("username");

    useEffect(() => {
        const handleStorage = () => setRefresh(prev => prev + 1);
        window.addEventListener("storage", handleStorage);
        return () => window.removeEventListener("storage", handleStorage);
    }, []);

    useEffect(() => {
        setIsMenuOpen(false);
    }, [location]);

    const handleLogout = () => {
        localStorage.clear();

        if (chrome?.storage?.local) {
            chrome.storage.local.remove("trust_token", () => {
                console.log("trust_token supprimé");
                chrome.storage.local.set({ trust_token_updated_at: Date.now() });
            });
        }

        window.location.href = "/";
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
            {/* Navbar moderne */}
            <nav className="bg-white shadow-md px-6 py-4">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center space-x-3 text-2xl font-bold text-centrale">
                            <img src="/logo.png" alt="Logo" className="h-12 w-12" />
                            <span>Secugram - Vos images, Votre sécurité</span>
                        </Link>
                    </div>

                    {/* Menu mobile */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-gray-500 hover:text-centrale focus:outline-none"
                        >
                            {isMenuOpen ? (
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>

                    {/* Menu desktop */}
                    <div className="hidden md:flex md:items-center md:space-x-6">
                        <Link
                            to="/"
                            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 
                                ${location.pathname === '/' ? 'text-centrale font-semibold' : 'text-gray-600 hover:text-centrale'}`}
                        >
                            Accueil
                        </Link>
                        {!isLoggedIn && (
                            <>
                                <Link
                                    to="/register"
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 
                                        ${location.pathname === '/register' ? 'text-centrale font-semibold' : 'text-gray-600 hover:text-centrale'}`}
                                >
                                    Inscription
                                </Link>
                                <Link
                                    to="/login"
                                    className="ml-6 px-4 py-2 rounded-md text-sm font-medium text-white bg-centrale hover:bg-red-700 transition-colors duration-200 shadow-sm"
                                >
                                    Connexion
                                </Link>
                            </>
                        )}
                        {isLoggedIn && (
                            <div className="flex items-center">
                                <span className="text-gray-600 mr-4">
                                    Bonjour, {localStorage.getItem("username")}
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 rounded-md text-sm font-medium text-white bg-centrale hover:bg-red-700 transition-colors duration-200 shadow-sm"
                                >
                                    Se déconnecter
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Menu mobile expandable */}
                {isMenuOpen && (
                    <div className="md:hidden mt-4 pt-4 border-t border-gray-200">
                        <div className="flex flex-col space-y-3">
                            <Link
                                to="/"
                                className={`px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 
                                    ${location.pathname === '/' ? 'text-centrale font-semibold' : 'text-gray-600 hover:text-centrale'}`}
                            >
                                Accueil
                            </Link>
                            {!isLoggedIn && (
                                <>
                                    <Link
                                        to="/register"
                                        className={`px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 
                                            ${location.pathname === '/register' ? 'text-centrale font-semibold' : 'text-gray-600 hover:text-centrale'}`}
                                    >
                                        Inscription
                                    </Link>
                                    <Link
                                        to="/login"
                                        className="px-3 py-2 rounded-md text-base font-medium text-centrale hover:text-red-700 transition-colors duration-200"
                                    >
                                        Connexion
                                    </Link>
                                </>
                            )}
                            {isLoggedIn && (
                                <button
                                    onClick={handleLogout}
                                    className="px-3 py-2 rounded-md text-base font-medium text-centrale hover:text-red-700 transition-colors duration-200 text-left"
                                >
                                    Se déconnecter
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </nav>

            {/* Zone centrale avec contenu en carte */}
            <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-5xl">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login />} />
                    </Routes>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-white shadow-inner px-6 py-4 mt-auto">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="text-sm text-gray-500">
                            © {new Date().getFullYear()} Secugram. Tous droits réservés.
                        </div>
                        {/*<div className="flex space-x-4 mt-4 md:mt-0">*/}
                            {/*<a href="#" className="text-gray-500 hover:text-centrale">*/}
                            {/*    À propos*/}
                            {/*</a>*/}
                            {/*<a href="#" className="text-gray-500 hover:text-centrale">*/}
                            {/*    Contact*/}
                            {/*</a>*/}
                            {/*<a href="#" className="text-gray-500 hover:text-centrale">*/}
                            {/*    Confidentialité*/}
                            {/*</a>*/}
                        {/*</div>*/}
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default App;