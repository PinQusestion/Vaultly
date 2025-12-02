const groupServices = require('../services/group.service');

// Create a new group
async function createGroup(req, res) {
  try {
    const userId = req.userId;
    const { name } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Group name is required',
      });
    }

    const result = await groupServices.createGroup(userId, { name: name.trim() });

    if (result.success) {
      return res.status(201).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error in createGroup controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}

// Get all groups for the authenticated user
async function getUserGroups(req, res) {
  try {
    const userId = req.userId;

    const result = await groupServices.getUserGroups(userId);

    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error in getUserGroups controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}

// Get a specific group by ID
async function getGroupById(req, res) {
  try {
    const userId = req.userId;
    const { groupId } = req.params;

    if (!groupId) {
      return res.status(400).json({
        success: false,
        message: 'Group ID is required',
      });
    }

    const result = await groupServices.getGroupById(groupId, userId);

    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(result.message === 'Group not found' ? 404 : 403).json(result);
    }
  } catch (error) {
    console.error('Error in getGroupById controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}

// Update group details
async function updateGroup(req, res) {
  try {
    const userId = req.userId;
    const { groupId } = req.params;
    const { name } = req.body;

    if (!groupId) {
      return res.status(400).json({
        success: false,
        message: 'Group ID is required',
      });
    }

    if (!name || name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Group name is required',
      });
    }

    const result = await groupServices.updateGroup(groupId, userId, { name: name.trim() });

    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(result.message === 'Group not found' ? 404 : 403).json(result);
    }
  } catch (error) {
    console.error('Error in updateGroup controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}

// Delete a group
async function deleteGroup(req, res) {
  try {
    const userId = req.userId;
    const { groupId } = req.params;

    if (!groupId) {
      return res.status(400).json({
        success: false,
        message: 'Group ID is required',
      });
    }

    const result = await groupServices.deleteGroup(groupId, userId);

    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(result.message === 'Group not found' ? 404 : 403).json(result);
    }
  } catch (error) {
    console.error('Error in deleteGroup controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}

// Add a member to a group
async function addGroupMember(req, res) {
  try {
    const userId = req.userId;
    const { groupId } = req.params;
    const { email, role } = req.body;

    if (!groupId) {
      return res.status(400).json({
        success: false,
        message: 'Group ID is required',
      });
    }

    if (!email || email.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Member email is required',
      });
    }

    // Validate role if provided
    if (role && !['member', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be "member" or "admin"',
      });
    }

    const result = await groupServices.addGroupMember(groupId, userId, {
      email: email.trim(),
      role: role || 'member',
    });

    if (result.success) {
      return res.status(201).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error in addGroupMember controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}

// Remove a member from a group
async function removeGroupMember(req, res) {
  try {
    const userId = req.userId;
    const { groupId, memberId } = req.params;

    if (!groupId || !memberId) {
      return res.status(400).json({
        success: false,
        message: 'Group ID and Member ID are required',
      });
    }

    const result = await groupServices.removeGroupMember(groupId, userId, memberId);

    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(result.message.includes('not found') ? 404 : 403).json(result);
    }
  } catch (error) {
    console.error('Error in removeGroupMember controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}

module.exports = {
  createGroup,
  getUserGroups,
  getGroupById,
  updateGroup,
  deleteGroup,
  addGroupMember,
  removeGroupMember,
};
