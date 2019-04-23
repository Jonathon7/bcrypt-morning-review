require("dotenv").config();
const express = require("express");
const session = require("express-session");
const massive = require("massive");
const PORT = 3002;
const { getSupplies, addToCart } = require("./controllers/cartCtlr");
const { getUser, login, signup } = require("./controllers/authCtlr");
const { checkForSession } = require("./middlewares/checkForSession");

const app = express();

app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
);

app.use(checkForSession);

massive(process.env.CONNECTION_STRING)
  .then(db => {
    app.set("db", db);
    console.log("Database Connected");
  })
  .catch(err => {
    console.log(err);
  });

app.get("/api/users", getUser);
app.get("/api/supplies", getSupplies);
app.post("/api/supplies/:id", addToCart);

app.post("/api/auth/signup", signup);
app.post("/api/auth/login", login);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
