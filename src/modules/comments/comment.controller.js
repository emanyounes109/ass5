const express = require('express');
const router = express.Router();
const commentService = require('./comment.service');

router.post('/', commentService.createComments);
router.post('/find-or-create', commentService.findOrCreateComment);
router.get('/search', commentService.searchComments);
router.get('/newest/:postId', commentService.getNewestComments);
router.get('/details/:id', commentService.getCommentDetails);
router.patch('/:commentId', commentService.updateComment);

module.exports = router;
