require('dotenv').config();
const express = require("express");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth.routes");
const expenseRoutes = require("./routes/expense.routes");
const userRoutes = require("./routes/user.routes");
const groupRoutes = require("./routes/group.routes");
const goalRoutes = require("./routes/goal.routes");

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;