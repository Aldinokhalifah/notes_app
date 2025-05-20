import { useState } from "react";
import axios from "axios";
import { FiX } from "react-icons/fi";

export default function EditNote({ onClose, onNoteEdited, note }) {
    const [editedNote, setEditedNote] = useState({
        title: note.title,
        content: note.content
    });
    const token = localStorage.getItem("token");

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {

             // Debug log
            console.log("Editing note:", note);
            console.log("Note customId:", note.customId);
            
            if (!note.customId) {
                throw new Error("Note customId is undefined");
            }

            const response = await axios.put(
                `${import.meta.env.VITE_API_URL}/api/notes/${note.customId}`,
                editedNote,
                { headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                } }
            );
            if (response.status === 200) {
                const updatedNote = {
                    ...note,
                    ...response.data.data,
                    customId: note.customId,
                    title: editedNote.title,
                    content: editedNote.content
                };
                onNoteEdited(updatedNote);
                onClose();
            }
        } catch (error) {
            console.error("Error updating note:", error);
            console.error("Note details:", note);
            console.error("Edited note details:", editedNote);
            console.error("Error updating note:", error);
        }
    };

    return (
        <div className="fixed inset-0 backdrop-blur-md bg-white/30 shadow-x bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Edit Note</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <FiX size={24} />
                    </button>
                </div>
                
                <form onSubmit={handleUpdate}>
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Title"
                            className="w-full p-2 border rounded-lg focus:ring focus:ring-blue-200"
                            value={editedNote.title}
                            onChange={(e) => setEditedNote({...editedNote, title: e.target.value})}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <textarea
                            placeholder="Content"
                            className="w-full p-2 border rounded-lg h-32 focus:ring focus:ring-blue-200"
                            value={editedNote.content}
                            onChange={(e) => setEditedNote({...editedNote, content: e.target.value})}
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
                            Update
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}