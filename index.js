const db = require("./db/connection");
const inquirer = require("inquirer");
const cTable = require("console.table");

/////////// prompt user and link routes//////////////
//what would you like to do? (options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role)
const promptUser = () => {
  return inquirer
    .prompt([
      {
        type: "list",
        name: "toDo",
        message: "What would you like to do?",
        choices: [
          "View all Employees",
          "View all Departments",
          "View all Roles",
          "Add a new Department",
          "Add a new Role",
          "Add a new Employee",
          "Update an Employee Role",
          "Exit",
        ],
        validate: (toDo) => {
          if (toDo) {
            return true;
          } else {
            console.log("Entry required!");
            return false;
          }
        },
      },
    ])
    .then((data) => {
      selectQuestion(data.toDo);
    })
    .catch((error) => {
      if (error.isTtyError) {
        console.log("an error has occured during toDo selection");
      } else {
        console.log("an error has occured during toDo selection");
      }
    });
};

const selectQuestion = (toDoAnswer) => {
  //if "View all Employees",
  if (toDoAnswer === "View all Employees") {
    viewAllEmployees();
  }

  //if "View all Departments",
  else if (toDoAnswer === "View all Departments") {
    viewAllDepartments();
  }
  //if "View all Roles",
  else if (toDoAnswer === "View all Roles") {
    viewAllRoles();
  }
  //if add department then
  //what is the name of the department
  else if (toDoAnswer === "Add a new Department") {
    addNewDepartment();
  }
  //console.log department added

  //if add role
  //name of role
  //salary of role
  //which department does the role belong to
  else if (toDoAnswer === "Add a new Role") {
    addNewRole();
  }
  //console.log added role to the database

  //if add employee
  //ask for these
  // "first_name",
  // "last_name",
  // "role_id",
  // "manager_id"
  else if (toDoAnswer === "Add a new Employee") {
    addNewEmployee();
  }
  //if update employee role
  //which employee's role do you want to update? (list of employee names to pick from)
  //which role
  else if (toDoAnswer === "Update an Employee Role") {
    updateRole();
  }
  //console.log employee X updated to role Y
  else {
    console.log("Have a Nice Day!");
  }
};
/////////////////end of prompts////////////

function viewAllEmployees() {
  const sql = `SELECT employee.*, role.salary 
AS Salary, role.title AS Job_Title, department.name AS Department 
FROM employee 
LEFT JOIN role ON employee.role_id = role.id
LEFT JOIN department ON role.department_id = department.id
ORDER BY employee.last_name`;
  db.query(sql, (err, rows) => {
    if (err) {
      console.log("an error has occured");
      return;
    }
    // console.log(rows);
    console.table(rows);
    promptUser();
  });
}

function viewAllDepartments() {}

function viewAllRoles() {}
function addNewDepartment() {}
function addNewRole() {}
function addNewEmployee() {
  /////add to get role choices?
  let roleTitleArray = [];
  let roleIDArray = [];
  let roleQuery = `SELECT * FROM role`;
  db.query(roleQuery, (err, res) => {
    if (err) {
      console.log("an error has occured");
      return;
    }
    for (i = 0; i < res.length; i++) {
      roleTitleArray.push(res[i].title);
      roleIDArray.push(res[i]);
    }
    console.log(res, roleTitleArray, roleIDArray);
  });
  inquirer
    .prompt([
      {
        type: "input",
        name: "first_name",
        message: "Enter Employee's First Name",
        validate: (first_name) => {
          if (first_name) {
            return true;
          } else {
            console.log("Entry required!");
            return false;
          }
        },
      },
      {
        type: "input",
        name: "last_name",
        message: "Enter Employee's Last Name",
        validate: (last_name) => {
          if (last_name) {
            return true;
          } else {
            console.log("Entry required!");
            return false;
          }
        },
      },
      {
        type: "list",
        name: "role_title",
        message: "Select Employee's Role",
        choices: roleTitleArray,
        validate: (role_title) => {
          if (role_title) {
            return true;
          } else {
            console.log("Entry required!");
            return false;
          }
        },
      },
    ])
    .then((data) => {
      //translate role_title into role_id
      let r = roleIDArray.indexOf(data.role_title);
      let role_id = roleIDArray[r].role.id;
      //send info to insert sql function
      const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
  VALUES (?,?,?,?)`;
      const params = [
        data.first_name,
        data.last_name,
        role_id,
        data.manager_id,
      ];
      db.query(sql, params, (err, result) => {
        if (err) {
          console.log("an error has occured");
          return;
        }
      }).catch((error) => {
        if (error.isTtyError) {
          console.log("an error has occured");
        } else {
          console.log("an error has occured");
        }
      });
      //console.log added first name last name to the database
      console.log(
        "added " + data.first_name + data.last_name + "to the database"
      );
      promptUser();
    });
}

function updateRole() {}

// Start server after DB connection
db.connect((err) => {
  if (err) throw err;
  promptUser();
});
