const express = require('express');

const router = express.Router();

const authMiddleware = require('../middleware/auth');
const groupController = require('../controllers/group');

router.post('/create-group', authMiddleware.authenticate,groupController.createGroup);

router.get('/get-groups', authMiddleware.authenticate, groupController.getGroups);

router.delete('/delete-group/:gId', authMiddleware.authenticate, groupController.deleteGroup);

router.post('/add-user', authMiddleware.authenticate, groupController.addUserToGroup);

router.get('/get-users', authMiddleware.authenticate, groupController.getUsers);

router.post('/make-admin', authMiddleware.authenticate, groupController.makeAdmin);

router.post('/remove-user', authMiddleware.authenticate, groupController.removeUser);

module.exports = router;