const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{username : "ahmed" ,password : 123}];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username) {
    return res.send("Username not entered!");
  }
  if (!password) {
    return res.send("Password not entered!");
  }

  const user = users.find((user) => user.username === username && user.password === password);

  if (!user) {
    return res.status(401).send("Invalid credentials");
  }

  const token = jwt.sign(user, "secret");
  req.session.accessToken = token;

  return res.status(200).json({ token });
});


// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { review } = req.body;
  const username = req.session.accessToken.username;

  if (!review) {  
    return res.status(400).send("Review not provided");
  }

  let book;
  for(key in books)
  {
    console.log(key);
    if(books[key].isbn == isbn)
    {
      book = books[key]
    }
  }

  if (!book) {
    return res.status(404).send("Book not found");
  }

  let existingReview;
  // Check if the user has already posted a review for the same ISBN
  for(key in book.reviews)
  {
    console.log(key);
    if(book.reviews[key].username == username)
    {
      existingReview = book.reviews[key]
    }
  }

  if (existingReview) {
    // Modify the existing review
    existingReview.review = review;
  } else {  
    // Add a new review
    book.reviews[`${book.reviews.length}`] = { username, review };
  }

  return res.status(200).json({ message: "Review added/modified successfully" });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const username = req.session.accessToken.username;

  let book;
  for (key in books) {
    if (books[key].isbn == isbn) {
      book = books[key];
      break;
    }
  }

  if (!book) {
    return res.status(404).send("Book not found");
  }

for(key in book.reviews){
  if(book.reviews[key].username == username){
    book.reviews.splice(key,1)
  }
}
  
  

  

  return res.status(200).json({ message: "Review deleted successfully" + JSON.stringify(book) });
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
