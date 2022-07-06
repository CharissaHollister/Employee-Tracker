const db = require("./db/connection");
const inquirer = require("inquirer");
const cTable = require("console.table");

/////////// Start server after DB connection/////////////
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
//Proceed to appropriate function based on toDo selection
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
  else if (toDoAnswer === "Add a new Department") {
    addNewDepartment();
  }
  //if add role
  else if (toDoAnswer === "Add a new Role") {
    addNewRole();
  }
  //if add employee
  else if (toDoAnswer === "Add a new Employee") {
    addNewEmployee();
  }
  //if update employee role
  else if (toDoAnswer === "Update an Employee Role") {
    updateRole();
  } else {
    console.log("Have a Nice Day!");
  }
};
/////////////////end of what to do prompt////////////

////////////functions for each toDo response/////////////
function viewAllEmployees() {
  //formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
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
    console.table(rows);
    //return to toDo prompt
    promptUser();
  });
}

function viewAllDepartments() {
  //formatted table showing department names and department ids
  const sql = `SELECT * FROM department`;
  db.query(sql, (err, rows) => {
    if (err) {
      console.log("an error has occured");
      return;
    }
    console.table(rows);
    //return to toDo prompt
    promptUser();
  });
}

function viewAllRoles() {
  //formatted table showing job title, role id, the department that role belongs to, and the salary for that role
  const sql = `SELECT role.id, role.salary, role.title AS Job_Title, department.name AS Department 
FROM role 
LEFT JOIN department ON role.department_id = department.id
ORDER BY role.id`;
  db.query(sql, (err, rows) => {
    if (err) {
      console.log("an error has occured");
      return;
    }
    console.table(rows);
    //return to toDo prompt
    promptUser();
  });
}
function addNewDepartment() {
  //what is the name of the department
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
        //console.log added to the database
        console.log("added " + data.department_name + " to the database");
        //return to toDo prompt
        promptUser();
      });
    });
}
function addNewRole() {
  //include: name of role,salary of role,which department does the role belong to
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
      //translate departmentName into departmentID
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
        //console.log added to the database
        console.log("added " + data.role_title + " to the database");
        //return to toDo prompt
        promptUser();
      });
    });
}
function addNewEmployee() {
  //ask for these "first_name","last_name","role_id","manager_id"
  //get role and manager options
  let roleTitleArray = [];
  let roleIDArray = [];
  let roleQuery = `SELECT * FROM role`;
  let mgrNameArray = [];
  let mgrIDArray = [];
  let mgrQuery = `SELECT * FROM employee WHERE role_id=3`;
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
        //console.log added to the database
        console.log(
          "added " + data.first_name + " " + data.last_name + " to the database"
        );
        //return to toDo prompt
        promptUser();
      });
    });
}

function updateRole() {
  //which employee's role do you want to update? (list of employee names to pick from)
  //which role (list to pick from)
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
    // console.log("role array:", roleTitleArray);

    db.query(employeeQuery, (err, res) => {
      if (err) {
        console.log("an error has occured");
        return;
      }
      for (i = 0; i < res.length; i++) {
        employeeNames = res[i].first_name + " " + res[i].last_name;
        employeeNameArray.push(employeeNames);
        employeeIDArray.push(res[i]);
      }
      // console.log("employee array", employeeNameArray);

      inquirer
        .prompt([
          {
            /////////isn't making the list to pick from show up
            type: "list",
            name: "employee_name",
            message: "Select Employee to Update",
            choices: employeeNameArray,
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
          //translate role_title into role_id and employeename into employeeID
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
            //console.log added to the database
            console.log(
              "Updated " +
                data.employee_name +
                " to role " +
                data.role_title +
                " in the database"
            );
            //return to toDo prompt
            promptUser();
          });
        });
    });
  });
}
////////////end of functions for each toDo response/////////////
