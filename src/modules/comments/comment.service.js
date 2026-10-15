const { Op } = require('sequelize');
const { User, Post, Comment } = require('../../DB/models');

const handleError = (error, res) => {
    if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({ message: error.errors.map((e) => e.message) });
    }
    if (error.name === 'SequelizeForeignKeyConstraintError') {
        return res.status(400).json({ message: 'Post or user does not exist' });
    }
    res.status(500).json({ message: error.message });
};

//1. Create a bulk of Comments
const createComments = async (req, res) => {
    try {
        await Comment.bulkCreate(req.body.comments, { validate: true });
        res.status(201).json({ message: 'comments created.' });
    } catch (error) {
        handleError(error, res);
    }
};

//2. Update the content of a comment (only the owner, the userId comes from the body)
const updateComment = async (req, res) => {
    try {
        const { userId, content } = req.body;
        const comment = await Comment.findByPk(req.params.commentId);
        if (!comment) {
            return res.status(404).json({ message: 'comment not found.' });
        }
        if (comment.userId !== Number(userId)) {
            return res.status(403).json({ message: 'You are not authorized to update this comment.' });
        }
        await comment.update({ content });
        res.json({ message: 'Comment updated.' });
    } catch (error) {
        handleError(error, res);
    }
};

//3. Find a comment for a post, user and content, if it does not exist create it
const findOrCreateComment = async (req, res) => {
    try {
        const { postId, userId, content } = req.body;
        const [comment, created] = await Comment.findOrCreate({
            where: { postId, userId, content }
        });
        res.json({ comment, created });
    } catch (error) {
        handleError(error, res);
    }
};

//4. Retrieve all comments that contain a specific word and return the count (find and count)
const searchComments = async (req, res) => {
    try {
        const { word } = req.query;
        const { count, rows } = await Comment.findAndCountAll({
            where: { content: { [Op.like]: `%${word}%` } }
        });
        if (count === 0) {
            return res.status(404).json({ message: 'no comments found.' });
        }
        res.json({ count, comments: rows });
    } catch (error) {
        handleError(error, res);
    }
};

//5. Retrieve the 3 most recent comments for a post
const getNewestComments = async (req, res) => {
    try {
        const comments = await Comment.findAll({
            where: { postId: req.params.postId },
            attributes: ['id', 'content', 'createdAt'],
            order: [['createdAt', 'DESC']],
            limit: 3
        });
        res.json(comments);
    } catch (error) {
        handleError(error, res);
    }
};

//6. Get a comment by PK with the user and post information
const getCommentDetails = async (req, res) => {
    try {
        const comment = await Comment.findByPk(req.params.id, {
            attributes: ['id', 'content'],
            include: [
                { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
                { model: Post, as: 'post', attributes: ['id', 'title', 'content'] }
            ]
        });
        if (!comment) {
            return res.status(404).json({ message: 'no comment found' });
        }
        res.json(comment);
    } catch (error) {
        handleError(error, res);
    }
};

module.exports = {
    createComments,
    updateComment,
    findOrCreateComment,
    searchComments,
    getNewestComments,
    getCommentDetails
};
