INSERT INTO departments (name)
VALUES ('Engineering'),('Finance'),('Legal'),('Sales');

SELECT * FROM departments;

INSERT INTO roles (title, salary, department_id)
VALUES ('Lead Engineer', 150000, 1),
('Software Engineer', 120000, 1),
('Account Manager', 120000, 2),
('Accountant', 85000, 2),
('Legal Team Lead', 150000, 3),
('Lawyer', 110000, 3),
('Sales Lead', 125000, 4),
('Salesperson', 75000, 4);

SELECT * FROM roles;

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ('Brad', 'Hambrick', 1, 1),
('Annie', 'Hambrick', 1, NULL),
('Minnie', 'Hambrick', 2, 3),
('Sadie', 'Hambrick', 2, NULL),
('Aerie', 'Hambrick', 3, 5),
('Cookie', 'Hambrick', 3, NULL),
('Lynn', 'Hambrick', 4, 7),
('Brixlee', 'Hambrick', 4, NULL);

SELECT * FROM employees;
