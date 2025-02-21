const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
const JWT_SECRET = "riteshhhh";

// Middleware for parsing JSON request bodies

app.use(express.json());
const users = [];

// localhost:3000
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/public/index.html");

})
app.post("/signup", function (req, res) {
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

app.post("/signin", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;
  let founduser = null;

  for (let i = 0; i < users.length; i++) {
    if (users[i].username === username && users[i].password === password) {
      founduser = users[i];
    }
  }
  if (!founduser ) {
    return res.status(401).json({ message: "Invalid username or password" });
   }else {
 
  const token = jwt.sign({username:founduser.username}, JWT_SECRET);
  res.json({
    message: "User authenticated successfully",
    token: token,
  });
}
});

function auth(req, res, next) {
  const token = req.headers.token;
  const decodedData = jwt.verify(token, JWT_SECRET);

  if (decodedData.username) {
    // req = {status, headers...., username, password, userFirstName, random; ":123123"}
    req.username = decodedData.username;
    next();
  } else {
    res.json({
      message: "You are not logged in",
    });
  }
}

// Middleware for validating JWT tokens
app.get("/me", auth, (req, res) => {
  //   console.log(decodedData);

  if (req.username) {
    username = req.username;
    let founduser = null;

    for (let i = 0; i < users.length; i++) {
      if (users[i].username === username) {
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
app.post("/logout", (req, res) => {
  

  res.json({ message: "User logged out successfully" });
})

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

// Error handling middleware
