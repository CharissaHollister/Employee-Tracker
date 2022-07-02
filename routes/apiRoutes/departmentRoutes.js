const express = require("express");
const router = express.Router();
const db = require("../../db/connection");
const inputCheck = require("../../utils/inputCheck");

////////////get all departments///////////////
//formatted table showing department names and department ids
router.get("/api/role", (req, res) => {
  const sql = `SELECT * FROM department`;
  db.query(sql, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: rows,
    });
  });
});

////////////create department////////////////
//prompted to enter the name of the department and that department is added to the database
//if add department then
//what is the name of the department
//console.log department added
router.post("/api/department", ({ body }, res) => {
  const errors = inputCheck(body, "name");
  if (errors) {
    res.status(400).json({ error: errors });
    return;
  }
  const sql = `INSERT INTO department (name)
  VALUES (?)`;
  const params = [body.name];

  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: body,
      //console.log added role to the database
    });
  });
});

module.exports = router;
