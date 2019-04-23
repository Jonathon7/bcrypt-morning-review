const getSupplies = (req, res) => {
  const db = req.app.get("db");

  db.get_supplies()
    .then(response => {
      res.status(200).json(response);
    })
    .catch(err => {
      res.status(500).json("error");
      console.log(err);
    });
};

const addToCart = async (req, res) => {
  const db = req.app.get("db");

  let item = await db.get_item(req.params.id);

  req.session.user.cart.push(item[0]);
  res.status(200).json(req.session.user);
};

module.exports = {
  getSupplies,
  addToCart
};
