const db = require("./db/connection");
const inquirer = require("inquirer");
const cTable = require("console.table");

// Start server after DB connection
db.connect((err) => {
  if (err) throw err;
  promptUser();
});

/////////// prompt user and link routes//////////////
//what would you like to do? (options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role)
const promptUser = async () => {
  try {
    const data = await inquirer.prompt([
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
        validate: (toDo_1) => {
          if (toDo_1) {
            return true;
          } else {
            console.log("Entry required!");
            return false;
          }
        },
      },
    ]);
    selectQuestion(data.toDo);
  } catch (error) {
    if (error.isTtyError) {
      console.log("an error has occured during toDo selection");
    } else {
      console.log("an error has occured during toDo selection");
    }
  }
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

function viewAllDepartments() {
  const sql = `SELECT * FROM department`;
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

function viewAllRoles() {
  const sql = `SELECT role.id, role.salary, role.title AS Job_Title, department.name AS Department 
FROM role 
LEFT JOIN department ON role.department_id = department.id
ORDER BY role.id`;
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
function addNewDepartment() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "department_name",
        message: "Enter the Department Name",
        validate: (department_name) => {
          if (department_name) {
            return true;
          } else {
            console.log("Entry required!");
            return false;
          }
        },
      },
    ])
    .then((data) => {
      //send info to insert sql function
      const sql = `INSERT INTO department (name)
  VALUES (?)`;
      const params = [data.department_name];
      db.query(sql, params, (err, result) => {
        if (err) {
          console.log("an error has occured");
          return;
        }
      });
      console.log("added " + data.department_name + " to the database");
      promptUser();
    });
}
function addNewRole() {
  //get dept options
  let departmentNameArray = [];
  let departmentIDArray = [];
  let departmentQuery = `SELECT * FROM department`;
  db.query(departmentQuery, (err, res) => {
    if (err) {
      console.log("an error has occured");
      return;
    }
    for (i = 0; i < res.length; i++) {
      departmentNameArray.push(res[i].name);
      departmentIDArray.push(res[i]);
    }
  });
  inquirer
    .prompt([
      {
        type: "input",
        name: "role_title",
        message: "Enter the Title for this Role",
        validate: (role_title) => {
          if (role_title) {
            return true;
          } else {
            console.log("Entry required!");
            return false;
          }
        },
      },
      {
        type: "input",
        name: "salary",
        message: "Enter Salary for the Role",
        validate: (salary) => {
          if (salary) {
            return true;
          } else {
            console.log("Entry required!");
            return false;
          }
        },
      },
      {
        type: "list",
        name: "departmentName",
        message: "Select Department",
        choices: departmentNameArray,
        validate: (departmentName) => {
          if (departmentName) {
            return true;
          } else {
            console.log("Entry required!");
            return false;
          }
        },
      },
    ])
    .then((data) => {
      //translate role_title into role_id and mgr into mgrId
      // console.log("data:", data);
      let nameLookup = data.departmentName;
      let r = departmentNameArray.indexOf(nameLookup);
      let dept_id = departmentIDArray[r].id;

      //send info to insert sql function
      const sql = `INSERT INTO role (title, salary, department_id)
  VALUES (?,?,?)`;
      const params = [data.role_title, data.salary, dept_id];
      db.query(sql, params, (err, result) => {
        if (err) {
          console.log("an error has occured");
          return;
        }
      });
      //console.log added first name last name to the database
      console.log("added " + data.role_title + " to the database");
      promptUser();
    });
}
function addNewEmployee() {
  //get role and manager options
  let roleTitleArray = [];
  let roleIDArray = [];
  let roleQuery = `SELECT * FROM role`;
  let mgrNameArray = [];
  let mgrIDArray = [];
  let mgrQuery = `SELECT * FROM employee`;
  db.query(roleQuery, (err, res) => {
    if (err) {
      console.log("an error has occured");
      return;
    }
    for (i = 0; i < res.length; i++) {
      roleTitleArray.push(res[i].title);
      roleIDArray.push(res[i]);
    }
  });
  db.query(mgrQuery, (err, res) => {
    if (err) {
      console.log("an error has occured");
      return;
    }
    for (i = 0; i < res.length; i++) {
      mgrNameArray.push(res[i].first_name);
      mgrIDArray.push(res[i]);
    }
    mgrNameArray.push("none");
    mgrIDArray.push({ id: null });
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
      {
        type: "list",
        name: "manager",
        message: "Select Employee's Manager",
        choices: mgrNameArray,
      },
    ])
    .then((data) => {
      //translate role_title into role_id and mgr into mgrId
      let titleLookup = data.role_title;
      let r = roleTitleArray.indexOf(titleLookup);
      let role_id = roleIDArray[r].id;
      let mgrLookup = data.manager;
      let m = mgrNameArray.indexOf(mgrLookup);
      let manager_id = mgrIDArray[m].id;
      //send info to insert sql function
      const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
  VALUES (?,?,?,?)`;
      const params = [data.first_name, data.last_name, role_id, manager_id];
      db.query(sql, params, (err, result) => {
        if (err) {
          console.log("an error has occured");
          return;
        }
      });
      //console.log added first name last name to the database
      console.log(
        "added " + data.first_name + " " + data.last_name + " to the database"
      );
      promptUser();
    });
}

function updateRole() {
  //get role and manager options
  let roleTitleArray = [];
  let roleIDArray = [];
  let roleQuery = `SELECT * FROM role`;
  let employeeNameArray = [];
  let employeeIDArray = [];
  let employeeQuery = `SELECT * FROM employee`;
  db.query(roleQuery, (err, res) => {
    if (err) {
      console.log("an error has occured");
      return;
    }
    for (i = 0; i < res.length; i++) {
      roleTitleArray.push(res[i].title);
      roleIDArray.push(res[i]);
    }
  });
  db.query(employeeQuery, (err, res) => {
    if (err) {
      console.log("an error has occured");
      return;
    }
    for (i = 0; i < res.length; i++) {
      employeeNames = res[i].first_name + "" + res[i].last_name;
      employeeNameArray.push(employeeNames);
      employeeIDArray.push(res[i]);
    }
  });
  inquirer
    .prompt([
      {
        type: "input",
        name: "employee_name",
        message: "Select Employee to Update",
        validate: (employee_name) => {
          if (employee_name) {
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
      //translate role_title into role_id and mgr into mgrId
      let titleLookup = data.role_title;
      let r = roleTitleArray.indexOf(titleLookup);
      let role_id = roleIDArray[r].id;
      let employeeLookup = data.employee_name;
      let e = employeeNameArray.indexOf(employeeLookup);
      let employee_id = employeeIDArray[e].id;
      //send info to insert sql function
      const sql = `UPDATE employee SET role_id = ? 
               WHERE id = ?`;
      const params = [role_id, employee_id];
      db.query(sql, params, (err, result) => {
        if (err) {
          console.log("an error has occured");
          return;
        }
      });
      //console.log added first name last name to the database
      console.log(
        "Updated " +
          data.employee_name +
          " to role " +
          data.role_title +
          " in the database"
      );
      promptUser();
    });
}
