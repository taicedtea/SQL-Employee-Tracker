USE employeeTracker_db;

INSERT INTO departments (name)
VALUES
    ('Administration'),
    ('Marketing'),
    ('Engineering'),
    ('Accounting'),
    ('Research');

INSERT INTO roles (title, department_id, salary)
VALUES
    ('CEO', 1, NULL),
    ('Manager', 2, 200000),
    ('Software Engineer', 3, 150000),
    ('Accountant', 4, 90000),
    ('Researcher', 5, 120000);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
    ('Donna', 'Hawkins', 1, NULL),
    ('Bradley', 'Perry', 2, NULL),
    ('Erik', 'Gould', 3, 2),
    ('Lisa', 'Henry', 4, 2),
    ('Abdul', 'Hampton', 5, 2);

