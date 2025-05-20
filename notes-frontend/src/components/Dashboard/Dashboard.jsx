import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiUser, FiEdit, FiTrash2, FiClock } from "react-icons/fi";
import { checkInactivity } from "../../utils/checkInactivity";
import EditNote from "../pages/editNote";
import Aside from "../Aside";

export default function Dashboard() {
    const [user, setUser] = useState(null);
    const [notes, setNotes] = useState([]);
    const navigate = useNavigate();
    const [isEditNoteOpen, setIsEditNoteOpen] = useState(false);
    const [selectedNote, setSelectedNote] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

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
                
                // Pastikan setiap note memiliki customId yang unik
                // Gunakan notes.data.data jika sesuai dengan API
                const notesWithUniqueIds = notes.data.data.map((note, index) => ({
                    ...note,
                    // Jika note.customId tidak ada, gunakan note.id atau buat ID unik baru
                    uniqueId: note.customId || note.id || `note-${index}-${Date.now()}`
                }));
                
                // Hapus duplikat note berdasarkan title dan content
                const uniqueNotes = removeDuplicateNotes(notesWithUniqueIds);
                
                setNotes(uniqueNotes);
                
                // Log untuk debugging
                console.log("Notes fetched:", uniqueNotes.length);
                
            } catch (err) {
                console.error("Gagal ambil data:", err.response || err);
                navigate("/login"); // Redirect kalau token tidak valid
            }
        };

        fetchData();
    }, [token, navigate]);
    
    // Fungsi untuk menghapus duplikat notes
    const removeDuplicateNotes = (notesArray) => {
        const uniqueMap = new Map();
        
        return notesArray.filter(note => {
            // Buat kunci unik berdasarkan title dan content
            const key = `${note.title}-${note.content}`;
            
            // Jika kunci sudah ada, ini adalah duplikat
            if (uniqueMap.has(key)) {
                return false;
            }
            
            // Tandai kunci ini sebagai sudah dilihat
            uniqueMap.set(key, true);
            return true;
        });
    };

    useEffect(() => {
        const handleActivity = () => {
            localStorage.setItem("lastActivity", Date.now());
        };

        window.addEventListener("mousemove", handleActivity);
        window.addEventListener("keydown", handleActivity);

        return () => {
            window.removeEventListener("mousemove", handleActivity);
            window.removeEventListener("keydown", handleActivity);
        };
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            if (checkInactivity()) {
                window.location.href = "/login"; // redirect ke login
            }
        }, 60000); // cek tiap 1 menit
        
        return () => clearInterval(interval);
    }, []);
        
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

    const handleNoteCreated = (newNote) => {
        // Pastikan format data sesuai
        const formattedNote = {
            ...newNote,
            customId: newNote.id, // Backend mengirim id sebagai customId
            uniqueId: newNote.id || `new-note-${Date.now()}`, // Tambahkan uniqueId untuk key
            createdAt: new Date().toISOString()
        };
        
        // Periksa apakah note ini duplikat
        const isDuplicate = notes.some(note => 
            note.title === formattedNote.title && 
            note.content === formattedNote.content
        );
        
        if (!isDuplicate) {
            setNotes(prevNotes => [...prevNotes, formattedNote]);
        } else {
            console.log("Mencegah duplikasi note:", formattedNote.title);
        }
    };

    const handleNoteEdited = (editedNote) => {
        setNotes(prevNotes => 
            prevNotes.map(note => 
                (note.customId === editedNote.customId || note.uniqueId === editedNote.uniqueId) 
                    ? {...editedNote, uniqueId: note.uniqueId || editedNote.customId || `edited-${Date.now()}`} 
                    : note
            )
        );
        setIsEditNoteOpen(false);
        setSelectedNote(null);
    };

    const handleNoteDelete = async (noteId) => {
        try {
            // Gunakan customId untuk API call
            await axios.delete(`http://localhost:5000/api/notes/${noteId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            
            // Hapus dari state menggunakan customId atau uniqueId
            setNotes(prevNotes => prevNotes.filter(note => 
                note.customId !== noteId && note.uniqueId !== noteId
            ));
            
            console.log("Note berhasil dihapus:", noteId);
        } catch (error) {
            console.error("Gagal menghapus note:", error.response?.data || error);
        }
    };

    // Filter notes berdasarkan search term
    const filteredNotes = notes.filter((note) => {
        if (!searchTerm) return true; // Jika search kosong, tampilkan semua notes
        
        const lowerCaseSearch = searchTerm.toLowerCase();
        const titleMatch = note.title?.toLowerCase().includes(lowerCaseSearch) || false;
        const contentMatch = note.content?.toLowerCase().includes(lowerCaseSearch) || false;
        
        return titleMatch || contentMatch;
    });
    
    // Debug untuk memastikan filtering bekerja
    console.log("Search Term:", searchTerm);
    console.log("Filtered Notes Count:", filteredNotes.length);

    return (
        <div className="flex flex-col md:flex-row h-screen w-full">
            {/* Sidebar */}
            <Aside 
                user={user}
                onNoteCreated={handleNoteCreated}
            />
        
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <header className="flex flex-col md:flex-row items-center gap-4 md:gap-4 p-4 md:px-8 md:py-4 bg-white">
                    <div className="w-full md:w-1/4 font-mono text-sm hidden md:block">
                        <p className="flex gap-1 items-center justify-center flex-col lg:flex-row">
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
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="w-full md:w-1/4 flex items-center justify-center md:justify-end">
                        <button
                            onClick={handleLogout}
                            className="hidden md:block w-full md:w-auto font-semibold hover:cursor-pointer px-6 py-2 bg-indigo-600 hover:bg-indigo-800 text-white rounded-md shadow-md transform transition-all"
                        >
                            Logout
                        </button>
                    </div>
                </header>
        
                {/* Body */}
                <main className="p-4 md:p-8 overflow-y-auto bg-gray-50 h-screen rounded-lg">
                    <h2 className="text-xl md:text-2xl font-semibold mb-4 font-mono text-center md:text-left">MY NOTES</h2>
                    
                    {filteredNotes.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto">
                            {filteredNotes.map((note, index) => {
                                const colors = ["bg-pink-200", "bg-blue-200", "bg-green-200", "bg-purple-200", "bg-yellow-200"];
                                const color = colors[index % colors.length];                                
                                const formattedDate = new Date(note.createdAt).toLocaleDateString('en-ID', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                });
                                
                                // Gunakan uniqueId sebagai key utama
                                const noteKey = note.uniqueId || note.customId || note.id || `note-${index}-${Date.now()}`;
        
                                return (
                                    <div key={noteKey} 
                                    className={`relative w-full ${color} rounded-xl p-4 flex flex-col min-h-[200px] max-h-[400px]`}>
                                        {/* Date section */}
                                        <div className="mb-1 text-xs md:text-sm flex items-center gap-2 text-gray-600">
                                            <FiClock size={14} />{formattedDate}
                                        </div>
                                        
                                        {/* Title and edit button section */}
                                        <div className="flex flex-col w-full">
                                            <div className="flex justify-between items-start w-full">
                                                <h2 className="text-lg md:text-xl font-bold text-black mb-2 line-clamp-2">
                                                    {note.title}
                                                </h2>
                                                <div className="p-1 hover:cursor-pointer">
                                                    <button
                                                        onClick={() => {
                                                            const noteToEdit = {
                                                                ...note,
                                                                customId: note.customId || note.id,
                                                                uniqueId: note.uniqueId || note.customId || note.id
                                                            };
                                                            setSelectedNote(noteToEdit);
                                                            setIsEditNoteOpen(true);
                                                        }}
                                                    >
                                                        <FiEdit size={18} className="text-gray-600 hover:text-gray-800" />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="bg-gray-800 w-full h-[0.5px] my-2"></div>
                                        </div>

                                        {/* Content section */}
                                        <div className="flex-1 overflow-y-auto mb-4">
                                            <p className="text-sm md:text-base text-gray-700 break-words">
                                                {note.content}
                                            </p>
                                        </div>
                                        
                                        {/* Delete button section - fixed at bottom */}
                                        <div className="flex items-center mt-auto text-gray-600 hover:cursor-pointer">
                                            <button
                                                onClick={() => handleNoteDelete(note.customId || note.uniqueId)}
                                                className="hover:text-gray-800 transition-colors"
                                            >
                                                <FiTrash2 size={18} className="mr-1" />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-center text-gray-700 italic">
                            {searchTerm ? "No notes matching your search" : "No notes available"}
                        </p>
                    )}
                    
                    {isEditNoteOpen && selectedNote && (
                        <EditNote
                            onClose={() => {
                                setIsEditNoteOpen(false);
                                setSelectedNote(null);
                            }}
                            onNoteEdited={handleNoteEdited}
                            note={selectedNote}
                        />
                    )}
                </main>
            </div>
        </div>
    );
}