const { User } = require('../../DB/models');

// helper to return validation errors in a clean way
const handleError = (error, res) => {
    if (error.name === 'SequelizeValidationError') {
        const messages = error.errors && error.errors.length
            ? error.errors.map((e) => e.message)
            : [error.message];
        return res.status(400).json({ message: messages });
    }
    res.status(500).json({ message: error.message });
};

//1. Create a new user (using build and save) (make sure that the email does not exist before)
const signup = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ message: 'Email already exists.' });
        }

        const user = User.build({ name, email, password, role });
        await user.save();

        res.status(201).json({ message: 'User added successfully.' });
    } catch (error) {
        handleError(error, res);
    }
};

//2. Create or update based on PK and use skip validation option
const createOrUpdateUser = async (req, res) => {
    try {
        await User.upsert({ ...req.body, id: req.params.id }, { validate: false });
        res.json({ message: 'User created or updated successfully' });
    } catch (error) {
        handleError(error, res);
    }
};

//3. Find a user by their email address
const getUserByEmail = async (req, res) => {
    try {
        const user = await User.findOne({
            where: { email: req.query.email },
            attributes: { exclude: ['password'] }
        });
        if (!user) {
            return res.status(404).json({ message: 'no user found' });
        }
        res.json({ user });
    } catch (error) {
        handleError(error, res);
    }
};

//4. Retrieve a user by their PK, excluding the "role" field
const getUserById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, {
            attributes: { exclude: ['role', 'password'] }
        });
        if (!user) {
            return res.status(404).json({ message: 'no user found' });
        }
        res.json(user);
    } catch (error) {
        handleError(error, res);
    }
};

module.exports = { signup, createOrUpdateUser, getUserByEmail, getUserById };
