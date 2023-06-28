const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Function to make GET request using Axios and return a promise
const makeGetRequest = (url) => {
  return new Promise((resolve, reject) => {
    axios
      .get(url)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};


public_users.post("/register", (req,res) => {
  //Write your code here
  username = req.body.username;
  password = req.body.password

  if(!username)
  {
    res.send("username not entered!")
  }
  if(!password)
  {
    res.send("password not entered!")
  }
  user = {username : username , password: password}
  users.push(user)
  return res.status(200).send("user added:" + JSON.stringify(user) );
});

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
  try {
    const bookList = await makeGetRequest('http://localhost:3000/books');
    return res.status(200).json({ books: bookList });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch book list" });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
  try {
    const isbn = req.params.isbn;
    const bookDetails = await makeGetRequest(`http://localhost:3000/books/isbn/${isbn}`);
    return res.status(200).json({ book: bookDetails });
  } catch (error) {
    return res.status(404).json({ error: "Book not found" });
  }
});

// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
  try {
    const author = req.params.author;
    const bookDetails = await makeGetRequest(`http://localhost:3000/books/author/${author}`);
    return res.status(200).json({ book: bookDetails });
  } catch (error) {
    return res.status(404).json({ error: "Book not found" });
  }
});

// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
  try {
    const title = req.params.title;
    const bookDetails = await makeGetRequest(`http://localhost:3000/books/title/${title}`);
    return res.status(200).json({ book: bookDetails });
  } catch (error) {
    return res.status(404).json({ error: "Book not found" });
  }
});

// Get book review
public_users.get('/review/:isbn', async (req, res) => {
  try {
    const isbn = req.params.isbn;
    const bookDetails = await makeGetRequest(`http://localhost:3000/books/review/${isbn}`);
    return res.status(200).json({ reviews: bookDetails.reviews });
  } catch (error) {
    return res.status(404).json({ error: "Book not found" });
  }
});

module.exports.general = public_users;
