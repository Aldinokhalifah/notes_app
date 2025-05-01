const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    customId: Number,
    title: String,
    content: String,
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Note', noteSchema);
