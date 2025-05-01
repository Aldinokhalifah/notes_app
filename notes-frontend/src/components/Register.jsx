import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

export default function Register() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', email: '', password: '' });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    const login = () => {
        navigate("/login");
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:5000/api/auth/register", form);
            alert(res.data.message); // Tampilkan pesan sukses
            navigate("/login");
        } catch (err) {
            alert(err.response?.data?.message || "Terjadi kesalahan pada server");
        }
    }

    return (
        <div 
            style={{ animation: "slideInFromLeft 1s ease-out" }}
            className="max-w-md w-full bg-gradient-to-r from-blue-800/30 to-emerald-600/30 backdrop-blur-md rounded-xl overflow-hidden p-8 space-y-8 shadow-[0_0_50px_-12px] shadow-blue-500/50 border border-blue-500/20"
        >
            <h2 
                style={{ animation: "appear 2s ease-out" }}
                className="text-center text-4xl font-extrabold text-white drop-shadow-[0_0_10px_rgba(0,255,255,0.5)]"
            >
                Welcome
            </h2>
            <p style={{ animation: "appear 3s ease-out" }} className="text-center text-gray-800">
                Sign up to your account
            </p>
            <form method="POST" action="#" onSubmit={handleSubmit} className="space-y-6">
                <div className="relative">
                    <input
                        placeholder="john"
                        onChange={handleChange}
                        className="peer h-10 w-full border-b-2 border-gray-300/50 text-white bg-transparent placeholder-transparent focus:outline-none focus:border-emerald-500 focus:shadow-[0_4px_8px_-4px] focus:shadow-emerald-500/50 transition-all duration-300"
                        required
                        id="name"
                        name="name"
                        type="text"
                    />
                    <label className="absolute left-0 -top-3.5 text-gray-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-emerald-500 peer-focus:text-sm" htmlFor="name">Name</label>
                </div>
                <div className="relative">
                    <input
                        placeholder="john@example.com"
                        onChange={handleChange}
                        className="peer h-10 w-full border-b-2 border-gray-300/50 text-white bg-transparent placeholder-transparent focus:outline-none focus:border-emerald-500 focus:shadow-[0_4px_8px_-4px] focus:shadow-emerald-500/50 transition-all duration-300"
                        required
                        id="email"
                        name="email"
                        type="email"
                    />
                    <label className="absolute left-0 -top-3.5 text-gray-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-emerald-500 peer-focus:text-sm" htmlFor="email">Email address</label>
                </div>
                <div className="relative">
                    <input
                        placeholder="Password"
                        onChange={handleChange}
                        className="peer h-10 w-full border-b-2 border-gray-300/50 text-white bg-transparent placeholder-transparent focus:outline-none focus:border-emerald-500 focus:shadow-[0_4px_8px_-4px] focus:shadow-emerald-500/50 transition-all duration-300"
                        required
                        id="password"
                        name="password"
                        type="password"
                    />
                    <label className="absolute left-0 -top-3.5 text-gray-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-emerald-500 peer-focus:text-sm" htmlFor="password">Password</label>
                </div>
                <button 
                    className="w-full py-2 px-4 bg-gradient-to-r from-blue-500/80 to-emerald-500/80 hover:from-blue-600/80 hover:to-emerald-600/80 rounded-md shadow-lg shadow-blue-500/50 hover:shadow-emerald-500/50 text-white font-semibold transition duration-300"
                    type="submit"
                >
                    Sign Up
                </button>
            </form>
            <div className="text-center text-gray-800">
                Already have an account?
                <a className="text-emerald-500 hover:underline" href="#" onClick={login}>Sign in</a>
            </div>
        </div>
    );
}