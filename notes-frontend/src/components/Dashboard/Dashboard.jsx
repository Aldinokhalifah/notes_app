import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiPlus, FiSearch, FiUser, FiEdit, FiTrash2, FiClock } from "react-icons/fi";

export default function Dashboard() {
    const [user, setUser] = useState(null);
    const [notes, setNotes] = useState([]);
    const navigate = useNavigate();

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

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const today = new Date();

    const formattedDate = today.toLocaleDateString('en-ID', {
        weekday: 'long',
        year: 'numeric', 
        month: 'long',
        day: 'numeric'
    });
    


    return(
            <div className="flex flex-col md:flex-row h-screen w-full">
            {/* Sidebar */}
            <aside className="w-full md:w-24 bg-white flex md:flex-col items-center justify-between md:justify-start p-4 md:py-6 md:space-y-6">
                <p className="px-1 font-bold text-gray-800 text-center font-mono text-balance">Hello, {user?.name}</p>
                <div className="flex md:flex-col items-center gap-4 md:gap-6">
                    <FiUser  className="text-gray-700 hover:cursor-pointer text-2xl" />
                    <button className="p-2 bg-black text-white font-semibold rounded-full hover:cursor-pointer hover:bg-gray-800 hover:rotate-45 transition-all duration-300">
                        <FiPlus />
                    </button>
                    <button
                            onClick={handleLogout}
                            className="sm:hidden w-full md:w-auto font-semibold hover:cursor-pointer px-3 py-1 bg-black hover:bg-gray-800 text-white rounded-md shadow-md transform transition-all"
                        >
                            Logout
                        </button>
                </div>
            </aside>
        
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <header className="flex flex-col md:flex-row items-center gap-4 md:gap-0 p-4 md:px-8 md:py-4 bg-white">
                    <div className="w-full md:w-1/4 font-mono text-sm text-center md:text-left">
                        <p className="flex gap-1 justify-center md:justify-start">
                            Today : <span className="font-semibold">{formattedDate}</span>
                        </p>
                    </div>
                    <div className="w-full md:w-1/2 flex items-center justify-center">
                        <div className="relative w-full max-w-md">
                            <FiSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search"
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring"
                            />
                        </div>
                    </div>
                    <div className="w-full md:w-1/4 flex items-center justify-center md:justify-end">
                        <button
                            onClick={handleLogout}
                            className="hidden sm:block w-full md:w-auto font-semibold hover:cursor-pointer px-6 py-2 bg-black hover:bg-gray-800 text-white rounded-md shadow-md transform transition-all"
                        >
                            Logout
                        </button>
                    </div>
                </header>
        
                {/* Body */}
                <main className="p-4 md:p-8 overflow-y-auto bg-gray-50 h-screen rounded-lg">
                    <h2 className="text-xl md:text-2xl font-semibold mb-4 font-mono text-center md:text-left">MY NOTES</h2>
                    {notes.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto">
                            {notes.map((notes, index) => {
                                const colors = ["bg-pink-200", "bg-blue-200", "bg-green-200", "bg-purple-200", "bg-yellow-200"];
                                const color = colors[index % colors.length];
                                const Textcolors = ["text-pink-200", "text-blue-200", "text-green-200", "text-purple-200", "text-yellow-200"];
                                const Textcolor = Textcolors[index % Textcolors.length];
                                
                                const formattedDate = new Date(notes.createdAt).toLocaleDateString('en-ID', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                });
        
                                return (
                                    <div key={notes._id} 
                                        className={`relative w-full ${color} rounded-xl p-4 flex flex-col`}>
                                        <div className="mb-1 text-xs md:text-sm flex items-center gap-2 text-gray-600">
                                            <FiClock size={14} />{formattedDate}
                                        </div>
                                        
                                        <div className="flex justify-between items-start">
                                            <h2 className="text-lg md:text-xl font-bold text-black mb-4">
                                                {notes.title}
                                            </h2>
                                            <div className="bg-black rounded-md p-1 hover:cursor-pointer">
                                                <FiEdit size={18} className={`${Textcolor}`} />
                                            </div>
                                        </div>
                                    
                                        <div className="flex-1">
                                            <p className="text-sm md:text-base text-gray-700">
                                                {notes.content}
                                            </p>
                                        </div>
                                        
                                        <div className="flex items-center mt-4 text-gray-600 hover:cursor-pointer">
                                            <FiTrash2 size={18} className="mr-1" />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-center text-gray-700 italic">No Notes.</p>
                    )}
                </main>
            </div>
        </div>
    )
}