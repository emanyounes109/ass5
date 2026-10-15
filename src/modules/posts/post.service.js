const { sequelize } = require('../../DB/connection');
const { User, Post, Comment } = require('../../DB/models');

const handleError = (error, res) => {
    if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({ message: error.errors.map((e) => e.message) });
    }
    if (error.name === 'SequelizeForeignKeyConstraintError') {
        return res.status(400).json({ message: 'User does not exist' });
    }
    res.status(500).json({ message: error.message });
};

//1. Create new Post (using new instance and save)
const createPost = async (req, res) => {
    try {
        const { title, content, userId } = req.body;
        const post = new Post({ title, content, userId });
        await post.save();
        res.status(201).json({ message: 'Post created successfully.' });
    } catch (error) {
        handleError(error, res);
    }
};

//2. Delete a post by its id (only the owner can do it, the userId comes from the body)
const deletePost = async (req, res) => {
    try {
        const post = await Post.findByPk(req.params.postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found.' });
        }
        if (post.userId !== Number(req.body.userId)) {
            return res.status(403).json({ message: 'You are not authorized to delete this post.' });
        }
        await post.destroy(); // soft delete because the model is paranoid
        res.json({ message: 'Post deleted.' });
    } catch (error) {
        handleError(error, res);
    }
};

//3. Retrieve all posts with the user and the comments
const getPostsWithDetails = async (req, res) => {
    try {
        const posts = await Post.findAll({
            attributes: ['id', 'title'],
            include: [
                { model: User, as: 'user', attributes: ['id', 'name'] },
                { model: Comment, as: 'comments', attributes: ['id', 'content'] }
            ]
        });
        res.json(posts);
    } catch (error) {
        handleError(error, res);
    }
};

//4. Retrieve all posts and count the comments of each post
const getPostsCommentCount = async (req, res) => {
    try {
        const posts = await Post.findAll({
            attributes: [
                'id',
                'title',
                [sequelize.fn('COUNT', sequelize.col('comments.id')), 'commentCount']
            ],
            include: [{ model: Comment, as: 'comments', attributes: [] }],
            group: ['Post.id'],
            raw: true
        });
        res.json(posts);
    } catch (error) {
        handleError(error, res);
    }
};

module.exports = { createPost, deletePost, getPostsWithDetails, getPostsCommentCount };
