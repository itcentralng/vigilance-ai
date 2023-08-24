const express = require("express");
const { createUser, getUser } = require("./db");
const bcrypt = require("bcryptjs");
const router = express.Router();

router.post("/create", async (req, res) => {
  req.body.password = await bcrypt.hash(req.body.password, 10);
  const { data: newUser, error } = await createUser(req.body);
  if (error) res.send(error);
  else res.send(newUser);
});

router.post("/signin", async (req, res) => {
  const { data: user } = await getUser(req.body.email);
  const match = bcrypt.compare(req.body.password, user.password);
  if (!user) res.send({ message: "No user was found" });
  else if (!match) res.send({ message: "Incorrect login credentails" });
  else {
    delete user.password;
    res.send(user);
  }
});

module.exports = router;
