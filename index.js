const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
const JWT_SECRET = "ritesh";

// Middleware for parsing JSON request bodies

app.use(express.json());
const users = [];

// Middleware for handling authentication
app.post("/signUp", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;
  users.push({
    username: username,
    password: password,
  });

  res.json({
    message: "User SignUp successfully",
  });
});

app.post("/signIn", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;
  let founduser = null;

  for (let i = 0; i < users.length; i++) {
    if (users[i].username === username && users[i].password === password) {
      founduser = users[i];
    }
  }
  if (founduser === null) {
    return res.status(401).json({ message: "Invalid username or password" });
  }
  const token = jwt.sign({username}, JWT_SECRET);
  res.json({
    message: "User authenticated successfully",
    token: token,
  });
});

// Middleware for validating JWT tokens
app.get("/me", (req, res) => {
  token = req.headers.token;
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  const decodedData = jwt.verify(token, JWT_SECRET);
//   console.log(decodedData);
  if (!decodedData) {
    return res.status(401).json({ message: "Invalid token" });
  }
  if (decodedData.username) {
    let founduser = null;

    for (let i = 0; i < users.length; i++) {
      if (users [i].username === decodedData.username) {
        founduser = users[i];
      }
    }
    // console.log(founduser);
    if (founduser === null) {
      return res.status(401).json({ message: "User not found" });
    }
    res.json({
      username: founduser.username,
      password: founduser.password,
      message: "You are authenticated",
    });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

// Error handling middleware
