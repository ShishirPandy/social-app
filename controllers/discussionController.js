const Discussion = require('../models/discussion');

// Create a new discussion
exports.createDiscussion = async (req, res) => {
    try {
        const discussion = new Discussion({
            user: req.user.userId, // The user ID of the creator
            text: req.body.text, // The text content of the discussion
            image: req.file ? req.file.path : null, // The image associated with the discussion, if any
            hashTags: req.body.hashTags // The hashtags associated with the discussion
        });
        await discussion.save(); // Save the discussion to the database
        res.status(201).json(discussion); // Respond with the created discussion
    } catch (error) {
        res.status(500).json({ error: error.message }); // Respond with an error message
    }
};

// Update an existing discussion
exports.updateDiscussion = async (req, res) => {
    try {
        const { id } = req.params; // The ID of the discussion to update
        const updates = req.body; // The updates to apply
        const discussion = await Discussion.findByIdAndUpdate(id, updates, { new: true }); // Find and update the discussion
        if (!discussion) return res.status(404).json({ message: 'Discussion not found' }); // Respond if discussion not found
        res.status(200).json(discussion); // Respond with the updated discussion
    } catch (error) {
        res.status(500).json({ error: error.message }); // Respond with an error message
    }
};

// Delete a discussion
exports.deleteDiscussion = async (req, res) => {
    try {
        const { id } = req.params; // The ID of the discussion to delete
        const discussion = await Discussion.findByIdAndDelete(id); // Find and delete the discussion
        if (!discussion) return res.status(404).json({ message: 'Discussion not found' }); // Respond if discussion not found
        res.status(200).json({ message: 'Discussion deleted successfully' }); // Respond with success message
    } catch (error) {
        res.status(500).json({ error: error.message }); // Respond with an error message
    }
};

// Get discussions by hashtags
exports.getDiscussionsByTags = async (req, res) => {
    try {
        const { tags } = req.query; // The tags to search for
        const tagArray = tags.split(',').map(tag => tag.trim()); // Split and trim the tags
        const discussions = await Discussion.find({ hashTags: { $in: tagArray } }); // Find discussions with the specified tags
        res.status(200).json(discussions); // Respond with the found discussions
    } catch (error) {
        res.status(500).json({ error: error.message }); // Respond with an error message
    }
};

// Get discussions by text search
exports.getDiscussionsByText = async (req, res) => {
    try {
        const { text } = req.query; // The text to search for
        const discussions = await Discussion.find({ text: new RegExp(text, 'i') }); // Find discussions containing the text
        res.status(200).json(discussions); // Respond with the found discussions
    } catch (error) {
        res.status(500).json({ error: error.message }); // Respond with an error message
    }
};

// Like a discussion
exports.likeDiscussion = async (req, res) => {
    try {
        const { id } = req.params; // The ID of the discussion to like
        const discussion = await Discussion.findById(id); // Find the discussion by ID
        if (!discussion) return res.status(404).json({ message: 'Discussion not found' }); // Respond if discussion not found

        if (!discussion.likes.includes(req.user.userId)) { // Check if the user has not already liked the discussion
            discussion.likes.push(req.user.userId); // Add the user ID to the likes array
            await discussion.save(); // Save the updated discussion
        }
        res.status(200).json(discussion); // Respond with the updated discussion
    } catch (error) {
        res.status(500).json({ error: error.message }); // Respond with an error message
    }
};

// Comment on a discussion
exports.commentOnDiscussion = async (req, res) => {
    try {
        const { id } = req.params; // The ID of the discussion to comment on
        const { text } = req.body; // The text of the comment
        const discussion = await Discussion.findById(id); // Find the discussion by ID
        if (!discussion) return res.status(404).json({ message: 'Discussion not found' }); // Respond if discussion not found

        const comment = {
            user: req.user.userId, // The user ID of the commenter
            text, // The text of the comment
            likes: [], // Initialize likes as an empty array
            replies: [] // Initialize replies as an empty array
        };
        discussion.comments.push(comment); // Add the comment to the discussion's comments array
        await discussion.save(); // Save the updated discussion
        res.status(201).json(discussion); // Respond with the updated discussion
    } catch (error) {
        res.status(500).json({ error: error.message }); // Respond with an error message
    }
};

// Like a comment
exports.likeComment = async (req, res) => {
    try {
        const { discussionId, commentId } = req.params; // The IDs of the discussion and comment to like
        const discussion = await Discussion.findById(discussionId); // Find the discussion by ID
        if (!discussion) return res.status(404).json({ message: 'Discussion not found' }); // Respond if discussion not found

        const comment = discussion.comments.id(commentId); // Find the comment by ID
        if (!comment) return res.status(404).json({ message: 'Comment not found' }); // Respond if comment not found

        if (!comment.likes.includes(req.user.userId)) { // Check if the user has not already liked the comment
            comment.likes.push(req.user.userId); // Add the user ID to the likes array
            await discussion.save(); // Save the updated discussion
        }
        res.status(200).json(discussion); // Respond with the updated discussion
    } catch (error) {
        res.status(500).json({ error: error.message }); // Respond with an error message
    }
};

// Reply to a comment
exports.replyToComment = async (req, res) => {
    try {
        const { discussionId, commentId } = req.params; // The IDs of the discussion and comment to reply to
        const { text } = req.body; // The text of the reply
        const discussion = await Discussion.findById(discussionId); // Find the discussion by ID
        if (!discussion) return res.status(404).json({ message: 'Discussion not found' }); // Respond if discussion not found

        const comment = discussion.comments.id(commentId); // Find the comment by ID
        if (!comment) return res.status(404).json({ message: 'Comment not found' }); // Respond if comment not found

        const reply = {
            user: req.user.userId, // The user ID of the replier
            text, // The text of the reply
            likes: [] // Initialize likes as an empty array
        };
        comment.replies.push(reply); // Add the reply to the comment's replies array
        await discussion.save(); // Save the updated discussion
        res.status(201).json(discussion); // Respond with the updated discussion
    } catch (error) {
        res.status(500).json({ error: error.message }); // Respond with an error message
    }
};

// Like a reply
exports.likeReply = async (req, res) => {
    try {
        const { discussionId, commentId, replyId } = req.params; // The IDs of the discussion, comment, and reply to like
        const discussion = await Discussion.findById(discussionId); // Find the discussion by ID
        if (!discussion) return res.status(404).json({ message: 'Discussion not found' }); // Respond if discussion not found

        const comment = discussion.comments.id(commentId); // Find the comment by ID
        if (!comment) return res.status(404).json({ message: 'Comment not found' }); // Respond if comment not found

        const reply = comment.replies.id(replyId); // Find the reply by ID
        if (!reply) return res.status(404).json({ message: 'Reply not found' }); // Respond if reply not found

        if (!reply.likes.includes(req.user.userId)) { // Check if the user has not already liked the reply
            reply.likes.push(req.user.userId); // Add the user ID to the likes array
            await discussion.save(); // Save the updated discussion
        }
        res.status(200).json(discussion); // Respond with the updated discussion
    } catch (error) {
        res.status(500).json({ error: error.message }); // Respond with an error message
    }
};
