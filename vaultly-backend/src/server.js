require('dotenv').config();
const express = require("express");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth.routes.js");
const expenseRoutes = require("./routes/expense.routes.js");
const userRoutes = require("./routes/user.routes.js");
const groupRoutes = require("./routes/group.routes.js");
const goalRoutes = require("./routes/goal.routes.js");
const analyticsRoutes = require("./routes/analytics.routes.js");

const cors = require("cors");

const app = express();
app.use(cors({
    origin: [
        'http://localhost:3000',
        'https://vaultly-one.vercel.app'
    ],
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRoutes);
app.use("/expenses", expenseRoutes);
app.use("/users", userRoutes);
app.use("/groups", groupRoutes);
app.use("/goals", goalRoutes);
app.use("/analytics", analyticsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;