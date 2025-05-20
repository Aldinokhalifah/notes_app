import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiUser, FiMail, FiLock } from "react-icons/fi";

export default function Profile() {
    const [user, setUser] = useState(null);
    const [notes, setNotes] = useState([]);
    const [profile, setProfile] = useState({ name: "", email: "" });
    const [passwords, setPasswords] = useState({ current_password: "", password: "", password_confirmation: "" });
    const [activeHours, setActiveHours] = useState(0);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // Ambil token dari localStorage
    const token = localStorage.getItem("token");

    // Fetch user & notes saat mount
    useEffect(() => {
        if (!token) return navigate("/login");

        (async () => {
        try {
            const { data: userData } = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/profile`, { headers: { Authorization: `Bearer ${token}` } });
            setUser(userData);
            setProfile({ name: userData.name, email: userData.email });

            const { data: notesRes } = await axios.get(`${import.meta.env.VITE_API_URL}/api/notes`, { headers: { Authorization: `Bearer ${token}` } });
            setNotes(notesRes.data);
        } catch (err) {
            console.error(err);
            navigate("/login");
        }
        })();
    }, [token, navigate]);

    // Hitung active hours
    useEffect(() => {
        const calc = () => {
        const last = localStorage.getItem("lastActivity");
        if (!last) return 0;
        const diffH = (Date.now() - parseInt(last)) / 36e5;
        return Math.max(0, Math.round(diffH));
        };

        setActiveHours(calc());
        const iv = setInterval(() => setActiveHours(calc()), 60000);
        return () => clearInterval(iv);
    }, []);

    const handleProfileChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };

    const submitProfile = async (e) => {
        e.preventDefault();
        setMessage(""); setError("");
        try {
        await axios.put(
            `${import.meta.env.VITE_API_URL}/api/user/profile`,
            profile,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessage("Profile updated successfully.");
        } catch {
        setError("Failed to update profile.");
        }
    };

    const submitPassword = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");
        
        try {
            // Pastikan password baru dan konfirmasi sama
            if (passwords.password !== passwords.password_confirmation) {
                setError("New password and confirmation do not match");
                return;
            }

            await axios.put(
                `${import.meta.env.VITE_API_URL}/api/user/profile`,
                {
                    oldPassword: passwords.current_password, // Sesuaikan dengan backend
                    password: passwords.password
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setMessage("Password changed successfully.");
            setPasswords({ current_password: "", password: "", password_confirmation: "" });
        } catch (error) {
            setError(error.response?.data?.message || "Failed to change password.");
        }
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-100 w-full py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-8">
            {/* Header & Avatar */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-40 rounded-2xl relative shadow-lg">
            <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
                <div className="w-32 h-32 rounded-full bg-white p-1 shadow-xl">
                <FiUser className="w-full h-full rounded-full text-gray-400" />
                </div>
            </div>
            </div>
            <div className="pt-20 text-center">
            <h1 className="text-2xl font-semibold text-gray-800">{user.name}</h1>
            <p className="mt-1 text-gray-600 flex items-center justify-center gap-2">
                <FiMail /> {user.email}
            </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 text-center shadow">
                <div className="text-2xl font-bold text-gray-800">{notes.length}</div>
                <div className="text-sm text-gray-600">Total {notes.length < 2 ? 'Note' : 'Notes'}</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center shadow">
                <div className="text-2xl font-bold text-gray-800">{activeHours}</div>
                <div className="text-sm text-gray-600">{activeHours < 2 ? 'Hour' : 'Hours'} Active</div>
            </div>
            </div>

            {/* Message */}
            {(message || error) && (
            <div className={`p-4 rounded-md text-sm ${message ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{message || error}</div>
            )}

            {/* Profile Update Form */}
            <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-700 mb-4 flex items-center gap-2"><FiUser /> Profile Information</h2>
            <form onSubmit={submitProfile} className="space-y-4">
                <div>
                <label className="block text-sm font-medium text-gray-600">Name</label>
                <input
                    name="name"
                    value={profile.name}
                    onChange={handleProfileChange}
                    className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity- p-2"
                    required
                />
                </div>
                <div>
                <label className="block text-sm font-medium text-gray-600">Email</label>
                <input
                    name="email"
                    type="email"
                    value={profile.email}
                    onChange={handleProfileChange}
                    className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity- p-2"
                    required
                />
                </div>
                <div className="text-right">
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200">Save</button>
                </div>
            </form>
            </div>

            {/* Password Update Form */}
            <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-700 mb-4 flex items-center gap-2"><FiLock /> Change Password</h2>
            <form onSubmit={submitPassword} className="space-y-4">
                <div>
                <label className="block text-sm font-medium text-gray-600">Current Password</label>
                <input
                    name="current_password"
                    type="password"
                    value={passwords.current_password}
                    onChange={handlePasswordChange}
                    className="p-2 mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    required
                />
                </div>
                <div>
                <label className="block text-sm font-medium text-gray-600">New Password</label>
                <input
                    name="password"
                    type="password"
                    value={passwords.password}
                    onChange={handlePasswordChange}
                    className="p-2 mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
                </div>
                <div>
                <label className="block text-sm font-medium text-gray-600">Confirm Password</label>
                <input
                    name="password_confirmation"
                    type="password"
                    value={passwords.password_confirmation}
                    onChange={handlePasswordChange}
                    className="p-2 mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    required
                />
                </div>
                <div className="text-right">
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200">Update Password</button>
                </div>
            </form>
            </div>

            {/* Back to Dashboard */}
            <div className="text-center">
            <button onClick={() => navigate("/")} className="text-gray-600 hover:text-gray-800 transition-colors">← Back to Dashboard</button>
            </div>
        </div>
        </div>
    );
}
