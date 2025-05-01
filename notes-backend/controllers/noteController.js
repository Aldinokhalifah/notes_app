const Note = require('../models/note'); 
const Counter = require('../models/Counter');

const createNotes = async (req, res) => {
    try {
        const { title, content } = req.body;
        const userId = req.user.id; // dari token yang sudah di-verify
    
        // Validasi input (opsional tapi disarankan)
        if (!title || !content) {
            return res.status(400).json({
            message: 'Title dan content harus diisi',
            });
        }

        const notesCount = await Note.countDocuments({ userId });

        const newNote = new Note({
            customId: notesCount + 1,
            title,
            content,
            userId // tetap menggunakan userId
        });

        await newNote.save();

        const response = {
            message: 'Catatan berhasil dibuat',
            data: {
                id: newNote.customId,
                title: newNote.title,
                content: newNote.content,
                createdAt: newNote.createdAt
            },
        };

        res.status(201).json(response);
    } catch (error) {
        return res.status(422).json({
            message: 'Isi notes tidak valid',
            error: error.message,
        });
    }
};  

const getNotes = async (req, res) => {
    try {
        const userId = req.user.id;

        const notes = await Note.find({ userId }).sort({ customId: 1 });

        if (notes.length === 0) {
        return res.json({
            message: 'Data Tidak Ditemukan',
            data: []
        });
        }

        const response = {
        message: 'Menampilkan Data Catatan',
        data: notes
        };

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({
        message: 'Terjadi kesalahan pada server',
        error: error.message
        });
    }
};

const updateNotes = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;
        const userId = req.user.id;

        // Validasi input
        if (!title || !content) {
            return res.status(400).json({
                message: 'Title dan content harus diisi',
            });
        }

        const updatedNote = await Note.findOneAndUpdate(
            { customId: parseInt(id), userId },  // validasi user
            { title, content },
            { new: true }
        );

        if (!updatedNote) {
            return res.status(404).json({ message: 'Catatan tidak ditemukan.' });
        }

        res.status(200).json({
            message: 'Catatan berhasil diupdate',
            data: updatedNote,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Gagal mengupdate data',
            error: error.message
        });
    }
};


const deletenotes = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const deletedNote = await Note.findOne({ customId: parseInt(id), userId });

        if (!deletedNote) {
            return res.status(404).json({
                message: 'Catatan tidak ditemukan atau bukan milik Anda',
            });
        }

        await Note.deleteOne({ customId: parseInt(id), userId });

        const response = {
            message: 'Catatan berhasil dihapus',
            data: deletedNote,
        };

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({
            message: 'Gagal menghapus data',
            error: error.message,
        });
    }
};



module.exports = { getNotes, createNotes, updateNotes, deletenotes };