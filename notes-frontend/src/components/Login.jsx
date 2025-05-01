import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [form, setForm] = useState({email: '', password: ''});
    const navigate = useNavigate();
    const [ message, setMessage] = useState('');

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const register = () => {
        navigate("/register");
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(''); // Clear previous message
    
        try {
            const res = await axios.post("http://localhost:5000/api/auth/login", form);
    
            const token = res.data.token;
            localStorage.setItem("token", token); // Simpan token di localStorage
            
    
            setMessage("Login berhasil!");
            navigate("/");
        } catch (error) {
            // Memastikan kita menampilkan pesan error dengan benar
            if (error.response) {
                setMessage(error.response.data.message || "Terjadi kesalahan pada server");
            } else {
                setMessage("Terjadi kesalahan saat menghubungi server");
            }
        }
    };

    return (
        <div
        style={{ animation: "slideInFromLeft 1s ease-out" }}
        className="max-w-md w-full bg-gradient-to-r from-blue-800/30 to-emerald-800/30 backdrop-blur-md rounded-xl overflow-hidden p-8 space-y-8 shadow-[0_0_50px_-12px] shadow-blue-500/50 border border-blue-500/20"
        >
        <h2
        style={{ animation: "appear 2s ease-out" }}
        className="text-center text-4xl font-extrabold text-white drop-shadow-[0_0_10px_rgba(0,255,255,0.5)]"
        >
            Welcome
        </h2>
        <p style={{ animation: "appear 3s ease-out" }} className="text-center text-gray-800">
            Sign in to your account
        </p>
        
        {message && <p className="text-center text-md font-semibold text-red-500 mb-2">{message}</p>}

        <form method="POST" action="#" onSubmit={handleSubmit} className="space-y-6">


            <div className="relative">
            <input
                placeholder="john@example.com"
                onChange={handleChange}
                value={form.email}
                className="peer h-10 w-full border-b-2 border-gray-300/50 text-white bg-transparent placeholder-transparent focus:outline-none focus:border-emerald-500 focus:shadow-[0_4px_8px_-4px] focus:shadow-emerald-500/50 transition-all duration-300"
                required=""
                id="email"
                name="email"
                type="email"
            />
            <label
                className="absolute left-0 -top-3.5 text-gray-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-emerald-500 peer-focus:text-sm"
                for="email"
                >Email address</label
            >
            </div>
            <div className="relative">
            <input
                placeholder="Password"
                onChange={handleChange}
                value={form.password}
                className="peer h-10 w-full border-b-2 border-gray-300/50 text-white bg-transparent placeholder-transparent focus:outline-none focus:border-emerald-500 focus:shadow-[0_4px_8px_-4px] focus:shadow-emerald-500/50 transition-all duration-300"
                required=""
                id="password"
                name="password"
                type="password"
            />
            <label
                className="absolute left-0 -top-3.5 text-gray-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-emerald-500 peer-focus:text-sm"
                for="password"
                >Password</label
            >
            </div>
            <button
            className="w-full py-2 px-4 bg-gradient-to-r from-blue-500/80 to-emerald-500/80 hover:from-blue-600/80 hover:to-emerald-600/80 rounded-md shadow-lg shadow-blue-500/50 hover:shadow-emerald-500/50 text-white font-semibold transition duration-300"
            type="submit"
            >
            Sign In
            </button>
        </form>
        <div className="text-center text-gray-800">
            Don't have an account?
            <a className="text-emerald-500 hover:underline" href="" onClick={register}>Sign up</a>
        </div>
        </div>

    );
}