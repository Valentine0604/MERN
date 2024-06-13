const router = require("express").Router();
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const Joi = require("joi");

router.post("/", async (req, res) => {
    try {
        console.log("Received login request:", req.body);

        const { error } = validate(req.body);
        if (error) {
            console.error("Validation error:", error.details[0].message);
            return res.status(400).send({ message: error.details[0].message });
        }

        console.log("Validation successful.");

        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            console.error("User not found for email:", req.body.email);
            return res.status(401).send({ message: "Invalid Email or Password" });
        }

        console.log("User found:", user);

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            console.error("Invalid password for user:", user.email);
            return res.status(401).send({ message: "Invalid Email or Password" });
        }

        console.log("Password is valid.");

        const token = user.generateAuthToken();
        console.log("JWT token generated:", token);

        res.status(200).send({ data: token, message: "Logged in successfully" });
    } catch (error) {
        console.error("Internal Server Error:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

const validate = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required().label("Email"),
        password: Joi.string().required().label("Password")
    });
    return schema.validate(data);
};

module.exports = router;
