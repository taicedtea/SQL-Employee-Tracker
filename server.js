const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

//connects to employee tracker database
const db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: 'root',
      password: 'Password123',
      database: 'employeeTracker_db'
    },
    console.log(`Connected to the employeeTracker_db database.`)
  );

db.connect ((err) => {
    if (err) {
        console.log(err)
    } else {
        console.log(`
        ________  _______  __    ______  ______________
        / ____/  |/  / __ \/ /   / __ \ \/ / ____/ ____/
       / __/ / /|_/ / /_/ / /   / / / /\  / __/ / __/   
      / /___/ /  / / ____/ /___/ /_/ / / / /___/ /___   
     /_____/_/__/_/_/  _/_____/\____/_/_/_____/_____/   
        /  |/  /   |  / | / /   | / ____/ ____/ __ \    
       / /|_/ / /| | /  |/ / /| |/ / __/ __/ / /_/ /    
      / /  / / ___ |/ /|  / ___ / /_/ / /___/ _, _/     
     /_/  /_/_/  |_/_/ |_/_/  |_\____/_____/_/ |_|` 
        )
        managerStart();
    }
})

const managerStart = () => {
    return inquirer.prompt ([
        {
            type: 'list',
            name: 'tableOptions',
            message: 'Query options: ',
            choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role', 'Quit'],
        },
    ]).then(function({ tableOptions }){
        switch(tableOptions){
            case 'View all departments':
                viewAllDep();
                break
            case 'View all roles':
                viewAllRoles();
                break
            case 'View all employees':
                viewAllEmployees();
                break
            case 'Add a department':
                addDepartment()
                break
            case 'Add a role':
                addRole();
                break
            case 'Add an employee':
                addEmployee();
                break
            case 'Update an employee role':
                updateEmployee()
                break
            // case "Remove an existing employee":
            //     removeEmployee()
            //     break
            // case "Remove an existing department":
            //     removeDepartment()
            //     break
            // case "Remove an existing role":
            //     removeRole()
            //     break
            case "quit":
                db.end()
                console.log('thank you for using our employee tracker!')
                break
        }
    })
};

const viewAllDep = () => {
    const query = 'SELECT * FROM departments;'
    db.query(query, (err, res) => {
        if (err) {
            console.log(err);
        } else {
            console.table(res);
            managerStart();
        }
    })
}

const viewAllRoles = () => {
    const query = `
    SELECT roles.id, roles.title AS Title, 
    departments.name AS Department, 
    roles.salary AS Salary FROM roles 
    JOIN departments ON roles.department_id = departments.id
    `
    db.query(query, (err, res) => {
        if (err) {
            console.log(err)
        } else {
            console.table(res);
            managerStart();
        }
    })
}

const viewAllEmployees = () => {
    const query = `
    SELECT employees.*, roles.title, roles.salary
    FROM employees
    JOIN roles ON employees.role_id = roles.id
    `
    db.query(query, (err, res) => {
        if (err) {
            console.log(err)
        } else {
            console.table(res);
            managerStart();
        }
    })
}

const addDepartment = () => {
    return inquirer.prompt([
        {
            type: 'input',
            name: 'departmentName',
            message:'Please enter the new department name',
        }
    ])
    .then(newDep => {
        db.query('INSERT INTO departments SET ?', {name: newDep.departmentName}, 
        (err, res) => {
            if (err) {
                console.log(err)
            } else {
                console.log(`${newDep.departmentName} added to database`);
                managerStart();
            }
        })
    })
};

const addRole = () => {
    return inquirer.prompt([
        {
            type: 'input',
            name: 'roleTitle',
            message:'Please enter the new role title',
        },
        {
            type: 'input',
            name: 'salary',
            message:'Please enter role\'s salary',
        },
        {
            type: 'input',
            name: 'departmentID',
            message:'Please enter role\'s ID',
        },
    ])
    .then(newRole => {
        db.query('INSERT INTO roles SET ?', 
        {title: newRole.roleTitle, department_id: newRole.departmentID, salary: newRole.salary},
        (err, res) => {
            if (err) {
                console.log(err);
            } else {
                console.log(`${newRole.roleTitle} added to roles`)
                managerStart();
            }
        })
    })
}

const addEmployee = () => {
    return inquirer.prompt([
        {
            type: 'input',
            name: 'firstName',
            message:'Please enter the new employee\'s first name',
        },
        {
            type: 'input',
            name: 'lastName',
            message:'Please enter their last name',
        },
        {
            type: 'input',
            name: 'roleID',
            message:'Please enter their role ID',
        },
        {
            type: 'input',
            name: 'managerID',
            message:'Please enter their manager\'s ID',
        },
    ])
    .then(newEmployee => {
        db.query('INSERT INTO employees SET ?', 
        {first_name: newEmployee.firstName, last_name: newEmployee.lastName, role_id: newEmployee.roleID, manager_id: newEmployee.managerID},
        (err, res) => {
            if (err) {
                console.log(err);
            } else {
                console.log(`${newEmployee.firstName} ${newEmployee.lastName} added to employee list`)
                managerStart();
            }
        })
    })
}

const updateEmployee = () => {
    let answer = inquirer.prompt([
        {
            type: 'list',
            name: 'employeeName',
            message: 'Please choose the employee you wish to update',
            choices: () => {
                const employees = db.query('SELECT * FROM employees');
                const addEmployees = employees.map((emp) => {
                    return {
                        name: emp.first_name + ' ' + emp.last_name,
                        value: emp.id
                    }
                });
                return addEmployees
            }
        },
        {
            type: 'list',
            name: 'roleID',
            message: 'Please choose their new role',
            choices: () => {
                const roles = db.query('SELECT * FROM roles');
                const newRoles = roles.map((roles) => {
                    return {
                        name: roles.titlw,
                        value: roles.id
                    }
                });
                return newRoles
            }
        }
    ]);
    //updates employee role
    db.query(
        'UPDATE employeess SET role_id? WHERE id=?',
        [answer.roleID, answer.employeeName],
        (err, res) => {
            if (err) {
                console.log(err)
            } else {
                console.log('Employee updated');
                managerStart();
            }
        }
    )
}