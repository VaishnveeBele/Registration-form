const express = require("express");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const dotenv = require("dotenv");

const app = express();
dotenv.config();

const port = process.env.PORT || 3000;
const username = process.env.MONGODB_USERNAME || 'vaishu';
const password = process.env.MONGODB_PASSWORD || 'vaishu123';

// Using the provided MongoDB connection URL
const uri = `mongodb+srv://${username}:${password}@cluster0.6vvzddf.mongodb.net/myDatabase?retryWrites=true&w=majority`;

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log("Successfully connected to MongoDB.");
})
.catch((err) => {
    console.error("Connection error", err.message);
});

const registrationSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
});

// Model of registration schema
const Registration = mongoose.model("Registration", registrationSchema);

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/pages/index.html");
});

app.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await Registration.findOne({ email: email });
        if (!existingUser) {
            const registrationData = new Registration({
                name,
                email,
                password,
            });
            await registrationData.save();
            res.redirect("/success");
        } 
        else{
            alert("user already exist");
            res.redirect("/error")
             
        }
    } catch (error) {
        console.log(error);
        res.redirect("/error");
    }
});

app.get("/success", (req, res) => {
    res.sendFile(__dirname + "/pages/success.html");
});

app.get("/error", (req, res) => {
    res.sendFile(__dirname + "/pages/error.html");
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
