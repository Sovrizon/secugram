import { Routes, Route, Link } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';

function App() {
    return (
        <div className="min-h-screen flex flex-col">
            {/* Navbar */}
            <nav className="bg-blue-600 text-white p-4">
                <Link to="/" className="mr-4">Accueil</Link>
                <Link to="/register" className="mr-4">Inscription</Link>
                <Link to="/login">Connexion</Link>
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