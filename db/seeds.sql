INSERT INTO department (name)
VALUES
  ("Production"), ("Engineering"), ("Management");

INSERT INTO role (title, salary, department_id)
VALUES
  ("engineer", 50000, 2),
  ("manager", 70000, 3);
  ("administrator", 40000, 1)

  INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
  ("Bart", "Simpson", 2, null),
   ("Homer", "Simpson", 2, null),
  ("Lisa", "Simpson", 1, 1),
  ("Marge", "Simpson", 3, 2),
  ("Ned", "Flanders", 3, 2), 
  ("Krusty", "Klown", 1, 1)
  