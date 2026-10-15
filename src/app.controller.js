const { connectDB } = require('./DB/connection');
require('./DB/models'); // load the models and their relations before syncing

const userRouter = require('./modules/users/user.controller');
const postRouter = require('./modules/posts/post.controller');
const commentRouter = require('./modules/comments/comment.controller');

const bootstrap = async (app, express) => {
    app.use(express.json());
    app.use(['/users', '/user'], userRouter);
    app.use('/posts', postRouter);
    app.use('/comments', commentRouter);

    app.use((req, res) => {
        res.status(404).json({ message: 'Route not found' });
    });

    await connectDB();
    app.listen(3000, () => {
        console.log('Server is running on http://localhost:3000');
    });
};

module.exports = bootstrap;
