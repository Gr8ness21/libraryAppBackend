// DEPENDENCIES
const express = require("express");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT;
const uri = process.env.MONGO_URI;
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const Book = require("./models/Book.js");
const cors = require("cors");


// DATABASE
// MongoDB Connection
mongoose.connect(process.env.MONGO_URI);

const db = mongoose.connection
db.on('error', (error) => console.log(error.message + ' mongo is not running!'))
db.on('connected', () => console.log('mongo is connected!'))
db.on('disconnected', () => console.log('mongo has been disconnected!'))


// MIDDLEWARE
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(cors());



// ROUTES
// I.N.D.U.C.E.S.

// Index - List
app.get("/books/", async (req, res) => {
    // res.render("index.ejs") <- For testing!
    try {
        const allBooks = await Book.find({});
        res.json(allBooks)
    } catch (error) {
        console.error("There was an issue rendering all books: ", error)
        res.status(500).send(error)
    }
});

// Delete - Destroy or remove data from database
app.delete("/books/:id", async (req, res) => {

    try {

        const deletedBook = await Book.findByIdAndDelete(req.params.id);
        if (!deletedBook) {
            return res.status(404).send("Book Not Found");
        }
        res.json(deletedBook);

    } catch (error) {
        console.error("There was an issue deleting the book...", error);
        res.status(500).send("There was an issue deleting the book...");
    }

});


// Update - Perform the action of changing the content
app.put("/books/:id", async (req, res) => {

    try {

        const updatedBook = await Book.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        ).exec();

        if (!updatedBook) {
            return res.status(404).send("Book Not Found");
        }
        res.json(updatedBook);

    } catch (error) {
        console.error("There seems to be an issue with the update...", error);
        res.status(500).send("There seems to be an issue with the update...");
    }

});

// Create - Make a book!
app.post("/books/", async (req, res) => {

    try {
        const createdBook = await Book.create(req.body);
        console.log("Book has been successfully created!");
        console.log(createdBook);
        res.status(201).json(createdBook);
    } catch (error) {
        console.error("Error Creating The Book...", error);
        res.status(500).send("SORRY ISSUE CREATING BOOK!");
    }

});

// Edit - give us a form to edit content
app.get("/books/:id/edit", async (req, res) => {

    try {
        const foundBook = await Book.findById(req.params.id);
        if (!foundBook) {
            return res.status(404).send("Book Not Found");
        }
        res.json(foundBook);
    } catch (error) {
        console.error(error);
        res.status(500).send("SERVER ISSUE!");
    }

});

// Show - One Individual Book
app.get("/books/:id", async (req, res) => {
    try {
        const foundBook = await Book.findById(req.params.id);
        res.json(foundBook);
    } catch (error) {
        console.error("ISSUE FINDING INDIVIDUAL BOOK!", error);
        res.status(500).send("ISSUE FINDING INDIVIDUAL BOOK!");
    }

});

// PORT
app.listen(PORT, () => {
    console.log(`Sever is running on port: http://localhost:${PORT}`)
})