const express = require("express");
const router = express.Router();
const db = require("../../db/connection");
const inputCheck = require("../../utils/inputCheck");

/////////////get all roles///////////
//job title, role id, the department that role belongs to, and the salary for that role
router.get("/api/role", (req, res) => {
  const sql = `SELECT role.*, department.name AS Department 
FROM role 
LEFT JOIN department ON role.department_id = department.id`;
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

/////////////create role//////////
//prompted to enter the name, salary, and department for the role and that role is added to the database
//name of role, salary of role, which department does the role belong to
router.post("/api/role", ({ body }, res) => {
  const errors = inputCheck(body, "title", "salary", "department_id");
  if (errors) {
    res.status(400).json({ error: errors });
    return;
  }
  const sql = `INSERT INTO role (title, salary, department_id)
  VALUES (?,?,?)`;
  const params = [body.title, body.salary, body.department_id];

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
