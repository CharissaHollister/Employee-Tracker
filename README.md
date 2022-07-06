# Employee Tracker CLI

Authored by Charissa Hollister 07/05/2022

## Description
Employee Tracker is a command line application that can be used to track, add, and update your work force database. Database contains 3 tables to track and manager Departments, Roles, and Employees. _npm start_ can get the team organized and ready for success.

## Instructions
On initial set up it will be required that the user enters their specific login information in the db/connections.js file, install the npm packages, and run the mysql files db.sql and schema.sql to create a clean database.  
Once the database is present on the local computer all that is needed to begin the CLI is to enter _npm start_  
Users can continue to track, add, and update for as many loops as is necessary.  
Choosing quit from the main menu and entering Ctrl-C will exit the program.  

## Demo

### Demo online link
https://drive.google.com/file/d/1U3wVLoivhMRUWFRr5QmnUZAvYNQp-Z6k/view

### GitHub Repo
https://github.com/CharissaHollister/Employee-Tracker

## Future improvement opportunities
-Automatically exit without ctrl-c  
-Set up for import file seed population  
-Ask after entering new if they would like to enter another  
-Automatically show the updated database table after adding or updating a row  
-Seperate response functions from the main index.js main menu logic  


### Minimum customer criteria
AS A business owner  
I WANT to be able to view and manage the departments, roles, and employees in my company  
SO THAT I can organize and plan my business  

GIVEN a command-line application that accepts user input  
WHEN I start the application  
THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role  
WHEN I choose to view all departments  
THEN I am presented with a formatted table showing department names and department ids  
WHEN I choose to view all roles  
THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role  
WHEN I choose to view all employees  
THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to  
WHEN I choose to add a department  
THEN I am prompted to enter the name of the department and that department is added to the database  
WHEN I choose to add a role  
THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database  
WHEN I choose to add an employee  
THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database  
WHEN I choose to update an employee role  
THEN I am prompted to select an employee to update and their new role and this information is updated in the database  