INSERT INTO department (name)
VALUES
  ("admin");

INSERT INTO role (title, salary, department_id)
VALUES
  ("engineer", 1, 1),
  ("manager", 2, 1);

  INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
  ("Bart", "Simpson", 2, null),
  ("Lisa", "Simpson", 1, 1);
  