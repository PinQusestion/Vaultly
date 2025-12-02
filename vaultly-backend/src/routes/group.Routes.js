const express = require('express');
const groupControllers = require('../controllers/group.Controllers');
const authMiddleware = require('../middlewares/authMiddleware');

const groupRouter = express.Router();

// All routes require authentication
groupRouter.use(authMiddleware.authenticate);

// Group CRUD operations
groupRouter.post('/', groupControllers.createGroup);
groupRouter.get('/', groupControllers.getUserGroups);
groupRouter.get('/:groupId', groupControllers.getGroupById);
groupRouter.put('/:groupId', groupControllers.updateGroup);
groupRouter.delete('/:groupId', groupControllers.deleteGroup);

// Group member management
groupRouter.post('/:groupId/members', groupControllers.addGroupMember);
groupRouter.delete('/:groupId/members/:memberId', groupControllers.removeGroupMember);

module.exports = groupRouter;