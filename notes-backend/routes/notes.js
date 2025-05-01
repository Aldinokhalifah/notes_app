const express = require('express');
const router = express.Router();
const controller = require('../controllers/noteController');
const authenticate = require('../middleware/auth');

// Get all notes
router.get('/', authenticate, controller.getNotes);

// Create notes
router.post('/', authenticate, controller.createNotes); 

// Update notes
router.put('/:id', authenticate, controller.updateNotes); 

// Delete notes
router.delete('/:id', authenticate, controller.deletenotes); 

module.exports = router;
