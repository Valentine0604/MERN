require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connection = require('./db');
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const tokenVerification = require('./middleware/tokenVerification')

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(cors({
    origin: ['http://localhost:3000']
}));
app.get("/api/users/",tokenVerification)
app.get("/api/users/me",tokenVerification)
app.delete("/api/users/me",tokenVerification)
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

app.listen(port, () => console.log(`Listening on port ${port}`));
connection();