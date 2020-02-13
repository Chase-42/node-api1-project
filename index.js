// implement your API here
const express = require("express");
const db = require("./data/db.js");
const server = express();
server.use(express.json());

const port = 8000;
server.listen(port, () => console.log(`Server listening on port ${port}`));

// POST
server.post("/api/users", (req, res) => {
  const { name, bio } = req.body;
  if (name && bio) {
    db.insert({ name, bio })
      .then(result => {
        res.status(201).json({ name, bio });
      })
      .catch(err => {
        console.log("Error with POST/api/users", err);
        res.status(500).json({
          error: "There was an error while saving the user to the database"
        });
      });
  } else {
    res
      .status(400)
      .json({ errorMessage: "Please provide name and bio for the user." });
  }
});

// GET
server.get("/api/users/:id", (req, res) => {
  const id = req.params.id;
  db.findById(id)
    .then(users => {
      if (users) {
        res.status(200).json(users);
      } else {
        res
          .status(404)
          .json({ message: "The user with the specified ID does not exist." });
      }
    })
    .catch(err => {
      console.log("Error with GET/api/users", err);
      res
        .status(500)
        .json({ errorMessage: "The users information could not be retrieved" });
    });
});

// PUT
server.put("/api/users/:id", (req, res) => {
  const user = req.body;
  const id = req.params.id;

  if (user.bio && user.name) {
    db.findById(id)
      .then(result => {
        if (result) {
          db.update(id, user).then(result => {
            res.status(200).json(user);
          });
        } else {
          res
            .status(404)
            .json({ message: "The user with the specified ID does not exist" });
        }
      })
      .catch(err => {
        console.log("Error with PUT/api/users", err);
        res
          .status(500)
          .json({ error: "The user information could not be modified." });
      });
  } else {
    res
      .status(400)
      .json({ errorMessage: "Please provide name and bio for the user." });
  }
});

// DELETE
server.delete("/api/users/:id", (req, res) => {
  const id = req.params.id;
  db.remove(id)
    .then(result => {
      if (result) {
        res.status(200).json({ message: "Successfuly deleted user.", result });
      } else {
        res
          .status(404)
          .json({ message: "The user with the specified ID does not exist." });
      }
    })
    .catch(error => {
      console.log("Error with DELETE/api/users/:id", error);
      res.status(500).json({ errorMessage: "The user could not be removed" });
    });
});
