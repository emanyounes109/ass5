const { DataTypes, ValidationError } = require('sequelize');
const { sequelize } = require('../connection');

// custom validation method for the name, used inside the beforeCreate hook
function checkNameLength(name) {
    if (!name || name.length <= 2) {
        throw new ValidationError('Name must be greater than 2 characters');
    }
}

// Users (using define)
const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        // built-in validation to validate the email format
        validate: {
            isEmail: { msg: 'Invalid email format' }
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        // custom validation method
        validate: {
            checkPasswordLength(value) {
                if (value.length <= 6) {
                    throw new Error('Password must be greater than 6 characters');
                }
            }
        }
    },
    role: {
        type: DataTypes.ENUM('user', 'admin'),
        defaultValue: 'user'
    }
}, {
    tableName: 'users',
    timestamps: true,
    hooks: {
        beforeCreate: (user) => {
            checkNameLength(user.name);
        }
    }
});

module.exports = User;
