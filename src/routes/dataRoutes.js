const express = require('express');
const router = express.Router();
const dataController = require('../controllers/dataController');
router.post('/auth/login', dataController.login);
// 1. Route for Bulk Updates (e.g., PUT /api/cta)
router.put('/:file', dataController.updateItem);

// 2. Route for Single Item Updates (e.g., PUT /api/services/123)
router.put('/:file/:id', dataController.updateItem);
// 1. Specific Auth Route (MUST be above /:file)
// The rest of your routes...
router.get('/:file', dataController.getAll);
router.post('/:file', dataController.addItem);
router.delete('/:file/:id', dataController.deleteItem);

module.exports = router;