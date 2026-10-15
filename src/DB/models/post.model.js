const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../connection');

// Posts (using init)
class Post extends Model {}

Post.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    content: {
        type: DataTypes.TEXT
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Post',
    tableName: 'posts',
    timestamps: true,
    paranoid: true // soft delete (adds deletedAt)
});

module.exports = Post;
