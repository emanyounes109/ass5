const express = require('express');
const router = express.Router();
const userService = require('./user.service');

router.post('/signup', userService.signup);
router.get('/by-email', userService.getUserByEmail); // must be before /:id
router.put('/:id', userService.createOrUpdateUser);
router.get('/:id', userService.getUserById);

module.exports = router;
