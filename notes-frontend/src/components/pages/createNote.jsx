import { useState } from 'react';
import { FiX } from 'react-icons/fi';
import axios from 'axios';

export default function CreateNote({ onClose, onNoteCreated }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/notes`, 
                { title, content },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            if (response.status === 201) {
                onNoteCreated(response.data.data);
                onClose();
            }
        } catch (error) {
            console.error('Error creating note:', error);
        }
    };

    return (
        <div className="fixed inset-0 backdrop-blur-md bg-white/30 shadow-xl flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Create New Note</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <FiX size={24} />
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Title"
                            className="w-full p-2 border rounded-lg focus:ring focus:ring-blue-200"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <textarea
                            placeholder="Content"
                            className="w-full p-2 border rounded-lg h-32 focus:ring focus:ring-blue-200"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                        >
                            Create
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}