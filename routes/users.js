const express = require('express');
const { createUser, updateUser, deleteUser, listUsers, searchUserByName, followUser } = require('../controllers/userController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/', createUser);
router.put('/:id', authMiddleware, updateUser);
router.delete('/:id', authMiddleware, deleteUser);
router.get('/', listUsers);
router.get('/search', searchUserByName);
router.post('/follow/:id', authMiddleware, followUser);

module.exports = router;
