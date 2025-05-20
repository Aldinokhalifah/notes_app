import { FiPlus, FiUser, FiMenu, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import CreateNote from "./pages/createNote";

export default function Aside({ user, onNoteCreated }) {
    const [isCreateNoteOpen, setIsCreateNoteOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const handleProfile = ()=> {
        navigate("/profile");
    }

    return (
        <aside className="w-full md:w-24 bg-white flex md:flex-col items-center justify-between md:justify-start p-4 md:py-6 md:space-y-6 relative">
            {/* Hello message - always visible */}
            <p className="px-1 font-bold text-gray-800 text-center font-mono text-balance">
                Hello, {user?.name}
            </p>

            {/* Hamburger button for mobile/tablet */}
            <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden text-2xl cursor-pointer transition-all duration-300"
            >
                {isMenuOpen ? <FiX /> : <FiMenu />}
            </button>

            {/* Menu items - desktop view */}
            <div className="hidden md:flex md:flex-col items-center gap-4 md:gap-6">
                <button
                    onClick={handleProfile}
                >
                    <FiUser className="text-gray-700 hover:cursor-pointer text-2xl" />
                </button>
                <button 
                    onClick={() => setIsCreateNoteOpen(true)}
                    className="p-2 bg-indigo-600 text-white font-semibold rounded-full hover:cursor-pointer hover:bg-indigo-800 hover:rotate-45 transition-all duration-300"
                >
                    <FiPlus />
                </button>
            </div>

            {/* Mobile menu */}
            {isMenuOpen && (
                <div className="md:hidden absolute top-full right-0 w-48 bg-white/30 backdrop-blur-md shadow-xl rounded-lg py-2 z-50">
                    <div className="flex flex-col items-center gap-4 p-4">
                        <button
                            onClick={handleProfile}
                        >
                            <FiUser className="text-gray-700 hover:cursor-pointer text-2xl" />
                        </button>
                        <button 
                            onClick={() => {
                                setIsCreateNoteOpen(true);
                                setIsMenuOpen(false);
                            }}
                            className="p-2 bg-indigo-600 text-white font-semibold rounded-full hover:cursor-pointer hover:bg-indigo-800 hover:rotate-45 transition-all duration-300"
                        >
                            <FiPlus />
                        </button>
                        <button
                            onClick={handleLogout}
                            className="w-full font-semibold hover:cursor-pointer px-3 py-1 bg-indigo-600 hover:bg-indigo-800 text-white rounded-md shadow-md transform transition-all"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            )}

            {/* Create Note Modal */}
            {isCreateNoteOpen && (
                <CreateNote
                    onClose={() => setIsCreateNoteOpen(false)}
                    onNoteCreated={(newNote) => {
                        onNoteCreated(newNote);
                        setIsCreateNoteOpen(false);
                    }}
                />
            )}
        </aside>
    );
}