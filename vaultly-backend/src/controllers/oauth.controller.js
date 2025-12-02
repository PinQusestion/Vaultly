const { PrismaClient } = require('@prisma/client');
const { google } = require('googleapis');
const { oauth2Client, scopes } = require('../config/oauth.config');
const { generateAccessToken } = require('../services/auth.service');

const prisma = new PrismaClient();

// Google OAuth - Redirect to Google
const googleLogin = (req, res) => {
  const authorizeUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes
  });
  res.redirect(authorizeUrl);
};

// Google OAuth - Callback
const googleCallback = async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=no_code`);
  }

  try {
    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(code);

    // Set credentials
    oauth2Client.setCredentials(tokens);

    // Get user info
    const oauth2 = google.oauth2({
      auth: oauth2Client,
      version: 'v2'
    });

    const { data: userInfo } = await oauth2.userinfo.get();

    if (!userInfo.email) {
      throw new Error('No email found in Google user profile');
    }

    // Find or create user
    let user = await prisma.users.findUnique({
      where: { email: userInfo.email },
    });

    if (!user) {
      user = await prisma.users.create({
        data: {
          email: userInfo.email,
          full_name: userInfo.name || 'Google User',
          passwordHash: '',
        },
      });
    }

    // Generate JWT token
    const token = generateAccessToken({ userId: user.id, email: user.email });

    // Set cookie and redirect
    res.cookie('accessToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard`);
  } catch (error) {
    console.error('Google OAuth error:', error);
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=auth_failed`);
  }
};

module.exports = {
  googleLogin,
  googleCallback,
};
