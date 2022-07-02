const express = require("express");
const router = express.Router();
const db = require("../../db/connection");
const inputCheck = require("../../utils/inputCheck");

///////////// Get all employees///////////////
//employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
////confused by managers thing because I don't see manager title just mgr_id =role.id
router.get("/api/employee", (req, res) => {
  const sql = `SELECT employee.*, role.salary 
AS Salary, role.title AS Job Title, department.name AS Department 
FROM employee 
LEFT JOIN role ON employee.manager_id = role.id
LEFT JOIN department ON role.department_id = department.id
ORDER BY employee.last_name`;
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

///////////create employee///////////
//prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
//first name,last name,role,manager's name
//console.log added first name last name to the database
router.post("/api/employee", ({ body }, res) => {
  const errors = inputCheck(
    body,
    "first_name",
    "last_name",
    "role_id",
    "manager_id"
  );
  if (errors) {
    res.status(400).json({ error: errors });
    return;
  }
  const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
  VALUES (?,?,?)`;
  const params = [
    body.first_name,
    body.last_name,
    body.role_id,
    body.manager_id,
  ];
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

//////////update employee role///////////
//prompted to select an employee to update and their new role and this information is updated in the database
//which employee's role do you want to update? (list of employee names to pick from)
//which role

router.put("/api/employee/:id", (req, res) => {
  const errors = inputCheck(req.body, "role_id");

  if (errors) {
    res.status(400).json({ error: errors });
    return;
  }
  const sql = `UPDATE candidates SET role_id = ? 
               WHERE id = ?`;
  const params = [req.body.role_id, req.params.id];
  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
      // check if a record was found
    } else if (!result.affectedRows) {
      res.json({
        message: "Candidate not found",
      });
    } else {
      res.json({
        //console.log employee X updated to role Y
        message: "success",
        data: req.body,
        changes: result.affectedRows,
      });
    }
  });
});

module.exports = router;
