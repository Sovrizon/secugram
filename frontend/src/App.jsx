import { Routes, Route, Link } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';

function App() {
    return (
        <div className="min-h-screen flex flex-col">
            {/* Navbar */}
            <nav className="bg-blue-600 text-white p-4">
                <Link to="/register" className="mr-4">Inscription</Link>
                <Link to="/login">Connexion</Link>
            </nav>

            {/* Zone centrale */}
            <div className="flex-grow flex items-center justify-center bg-gray-100">
                <Routes>
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Home />} />
                    {/* <Route path="/" element={<Home />} /> ← si tu veux une page d’accueil */}
                </Routes>
            </div>
        </div>
    );
}

export default App;