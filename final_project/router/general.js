const express = require('express');
const axios = require('axios');

let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

// Register a new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: "Username and password are required"
    });
  }

  if (isValid(username)) {
    return res.status(409).json({
      message: "Username already exists"
    });
  }

  users.push({
    username: username,
    password: password
  });

  return res.status(201).json({
    message: "User registered successfully",
    username: username
  });
});

// Task 1 - Get all books
public_users.get('/', function (req, res) {
  return res.status(200).json(books);
});

// Task 2 - Get book by ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  if (!books[isbn]) {
    return res.status(404).json({
      message: "Book not found"
    });
  }

  return res.status(200).json(books[isbn]);
});

// Task 3 - Get books by author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const result = {};

  Object.keys(books).forEach(isbn => {
    if (
      books[isbn].author.toLowerCase() ===
      author.toLowerCase()
    ) {
      result[isbn] = books[isbn];
    }
  });

  if (Object.keys(result).length === 0) {
    return res.status(404).json({
      message: "No books found for this author"
    });
  }

  return res.status(200).json(result);
});

// Task 4 - Get books by title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const result = {};

  Object.keys(books).forEach(isbn => {
    if (
      books[isbn].title.toLowerCase() ===
      title.toLowerCase()
    ) {
      result[isbn] = books[isbn];
    }
  });

  if (Object.keys(result).length === 0) {
    return res.status(404).json({
      message: "No books found for this title"
    });
  }

  return res.status(200).json(result);
});

// Task 5 - Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  if (!books[isbn]) {
    return res.status(404).json({
      message: "Book not found"
    });
  }

  return res.status(200).json(books[isbn].reviews);
});

// =====================================================
// Tasks 10-13: Axios + Async/Await
// =====================================================

// Task 10 - Get all books using Axios
async function getAllBooks() {
  try {
    const response = await axios.get(
      'http://localhost:5000/'
    );

    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error retrieving all books:", error.message);
  }
}

// Task 11 - Get book by ISBN using Axios
async function getBookByISBN(isbn) {
  try {
    const response = await axios.get(
      `http://localhost:5000/isbn/${isbn}`
    );

    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error retrieving book by ISBN:", error.message);
  }
}

// Task 12 - Get books by author using Axios
async function getBooksByAuthor(author) {
  try {
    const response = await axios.get(
      `http://localhost:5000/author/${encodeURIComponent(author)}`
    );

    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error retrieving books by author:", error.message);
  }
}

// Task 13 - Get books by title using Axios
async function getBooksByTitle(title) {
  try {
    const response = await axios.get(
      `http://localhost:5000/title/${encodeURIComponent(title)}`
    );

    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error retrieving books by title:", error.message);
  }
}

module.exports.general = public_users;

module.exports.getAllBooks = getAllBooks;
module.exports.getBookByISBN = getBookByISBN;
module.exports.getBooksByAuthor = getBooksByAuthor;
module.exports.getBooksByTitle = getBooksByTitle;