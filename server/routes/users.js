const router = require("express").Router();
const {User, validate} = require("../models/user");
const bcrypt = require("bcrypt");

router.post("/", async (req, res) => {
    try {
        console.log("Received user creation request:", req.body);

        const {error} = validate(req.body);
        if (error) {
            console.error("Validation error:", error.details[0].message);
            return res.status(400).send({message: error.details[0].message});
        }

        console.log("Validation successful.");

        let user = await User.findOne({email: req.body.email});
        if (user) {
            console.error("User with email already exists:", req.body.email);
            return res.status(409).send({message: "User with given email already exists"});
        }

        console.log("User does not exist. Proceeding with user creation.");

        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashPassword = await bcrypt.hash(req.body.password, salt);

        user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: hashPassword
        });

        console.log("Creating user:", user);

        await user.save();
        console.log("User created successfully.");

        res.status(201).send({message: "User created successfully"});
    } catch (error) {
        console.error("Internal Server Error:", error);
        res.status(500).send({message: "Internal Server Error"});
    }
});

router.get("/", async (req, res) => {
    //pobranie wszystkich użytkowników z bd:
    User.find().exec()
        .then(async () => {
            const users = await User.find();
            //konfiguracja odpowiedzi res z przekazaniem listy użytkowników:
            res.status(200).send({data: users, message: "Lista użytkowników"});
        })
        .catch(error => {
            res.status(500).send({message: error.message});
        });
})

router.get("/me", async (req, res) => {
    try {


        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).send({ message: "User not found!" });
        }

        res.status(200).send({ data: user, message: "User details retrieved successfully" });
    } catch (error) {
        console.error("Error fetching user details:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

router.delete("/me", async (req, res) => {
    try {


        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).send({ message: "User not found!" });
        }
        await User.deleteOne(user)
        res.status(200).send({ data: user, message: "User deleted successfully" });
    } catch (error) {
        console.error("Error fetching user details:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

module.exports = router;
