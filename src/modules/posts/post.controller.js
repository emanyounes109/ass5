const express = require('express');
const router = express.Router();
const postService = require('./post.service');

router.post('/', postService.createPost);
router.get('/details', postService.getPostsWithDetails);
router.get('/comment-count', postService.getPostsCommentCount);
router.delete('/:postId', postService.deletePost);

module.exports = router;
