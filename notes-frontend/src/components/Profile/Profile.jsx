import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiUser, FiMail, FiEdit2, FiLogOut  } from "react-icons/fi";

export default function Profile() {
    const[user, setUser] = useState(null);
    const [notes, setNotes] = useState([]);
    const navigate = useNavigate();
    const [activeHours, setActiveHours] = useState(0);

     // Ambil token dari localStorage
    const token = localStorage.getItem("token");

    // Ambil data user dan notes saat halaman dibuka
    useEffect(() => {
        if (!token) {
            navigate("/login"); // Redirect jika belum login
            return;
        }

        const fetchData = async () => {
            try {
                // Ambil profil user
                const user = await axios.get("http://localhost:5000/api/user/profile", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUser(user.data);

                // Ambil semua notes
                const notes = await axios.get("http://localhost:5000/api/notes", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setNotes(notes.data.data);
            } catch (err) {
                console.error("Gagal ambil data:", err.response || err);
                navigate("/login"); // Redirect kalau token tidak valid
            }
        };

        fetchData();
    }, [token, navigate]);

    useEffect(() => {
        const calculateActiveHours = () => {
            const lastActivity = localStorage.getItem("lastActivity");
            if (!lastActivity) return 0;
    
            const now = Date.now();
            const diffInHours = (now - parseInt(lastActivity)) / (1000 * 60 * 60);
            return Math.max(0, Math.round(diffInHours));
        };
    
        setActiveHours(calculateActiveHours());
    
        const timer = setInterval(() => {
            setActiveHours(calculateActiveHours());
        }, 1000 * 60); // Update every minute
    
        return () => clearInterval(timer);
    }, []);

    return(
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
                    {/* Header Banner */}
                    <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600"></div>
                    
                    {/* Profile Content */}
                    <div className="relative px-6 pb-6">
                        {/* Avatar */}
                        <div className="relative -mt-16 mb-6">
                            <div className="w-32 h-32 mx-auto rounded-full shadow-lg bg-white p-2">
                                <div className="w-full h-full rounded-full bg-gradient-to-r from-blue-200 to-purple-200 flex items-center justify-center">
                                    <FiUser className="w-16 h-16 text-gray-600" />
                                </div>
                            </div>
                        </div>

                        {/* User Info */}
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-800 mb-2">
                                {user?.name}
                            </h2>
                            <div className="flex items-center justify-center text-gray-600 space-x-2">
                                <FiMail className="w-4 h-4" />
                                <span>{user?.email}</span>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="bg-gray-50 rounded-xl p-4 text-center">
                                <div className="text-2xl font-bold text-gray-800">{notes.length}</div>
                                <div className="text-sm text-gray-600">Total Notes</div>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-4 text-center">
                                <div className="text-2xl font-bold text-gray-800">
                                    {activeHours}
                                </div>
                                <div className="text-sm text-gray-600">
                                    {activeHours === 1 ? 'Hour' : 'Hours'} Active
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center gap-4">
                            <button 
                                className="flex items-center gap-2 p-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 shadow-md hover:shadow-lg"
                            >
                                <FiEdit2 className="w-4 h-4" />
                                Edit Profile
                            </button>
                            <button
                                onClick={() => {
                                    localStorage.removeItem("token");
                                    localStorage.removeItem("lastActivity");
                                    navigate("/login");
                                }}
                                className="flex items-center gap-2 p-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 shadow-md hover:shadow-lg"
                            >
                                <FiLogOut className="w-4 h-4" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>

                {/* Back to Dashboard Button */}
                <div className="text-center mt-6">
                    <button 
                        onClick={() => navigate("/")}
                        className="text-gray-600 hover:text-gray-800 transition-colors"
                    >
                        ← Back to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
}