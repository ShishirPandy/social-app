const express = require('express');
const multer = require('multer');
const { createDiscussion, updateDiscussion, deleteDiscussion, getDiscussionsByTags, getDiscussionsByText, likeDiscussion, commentOnDiscussion, likeComment, replyToComment, likeReply } = require('../controllers/discussionController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/', authMiddleware, upload.single('image'), createDiscussion);
router.put('/:id', authMiddleware, updateDiscussion);
router.delete('/:id', authMiddleware, deleteDiscussion);
router.get('/tags', getDiscussionsByTags);
router.get('/text', getDiscussionsByText);
router.post('/:id/like', authMiddleware, likeDiscussion);
router.post('/:id/comment', authMiddleware, commentOnDiscussion);
router.post('/:discussionId/comments/:commentId/like', authMiddleware, likeComment);
router.post('/:discussionId/comments/:commentId/reply', authMiddleware, replyToComment);
router.post('/:discussionId/comments/:commentId/replies/:replyId/like', authMiddleware, likeReply);

module.exports = router;
