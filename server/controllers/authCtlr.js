const bcrypt = require("bcryptjs");

const login = async (req, res) => {
  const { username, password } = req.body;
  const db = req.app.get("db");

  const user = await db.search_for_user(username);

  if (!user[0]) {
    return res.status(401).json("User not found");
  } else {
    let isAuthenticated = bcrypt.compareSync(password, user[0].password);

    if (!isAuthenticated) {
      return res.status(403).json("Incorrect username or password");
    } else {
      req.session.user = {
        username: user[0].username
      };
    }
  }

  res.status(200).json(req.session);
};

const signup = async (req, res) => {
  const db = req.app.get("db");
  const { username, password } = req.body;

  let user = await db.search_for_user(username);
  let existingUser = user[0];

  if (existingUser) {
    return res.status(403).json("Username taken");
  } else {
    const hash = await bcrypt.hash(password, 10).catch(err => {
      console.log(err);
    });

    db.register_user([username, hash]);

    req.session.user = {
      username
    };
    return res.status(200).json(req.session);
  }
};

const logout = (req, res) => {
  req.session.destroy();
};

const getUser = (req, res) => {
  res.status(200).json(req.session.user);
};

module.exports = {
  login,
  signup,
  logout,
  getUser
};
