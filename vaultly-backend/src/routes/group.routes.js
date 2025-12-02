const express = require('express');
const groupController = require("../controllers/group.controller");
const authMiddleware = require('../middlewares/authMiddleware');

const groupRouter = express.Router();

// All routes require authentication
groupRouter.use(authMiddleware.authenticate);

// Group CRUD operations
groupRouter.post('/', groupController.createGroup);
groupRouter.get('/', groupController.getUserGroups);
groupRouter.get('/:groupId', groupController.getGroupById);
groupRouter.put('/:groupId', groupController.updateGroup);
groupRouter.delete('/:groupId', groupController.deleteGroup);

// Group member operations
groupRouter.post('/:groupId/members', groupController.addGroupMember);
groupRouter.delete('/:groupId/members/:memberId', groupController.removeGroupMember);

module.exports = groupRouter;