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
            case "update an employee role":
                updateEmployee()
                break
            // case "remove an existing employee":
            //     removeEmployee()
            //     break
            // case "remove an existing department":
            //     removeDepartment()
            //     break
            // case "remove an existing role":
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
    JOIN roles ON employees.roles_id = roles.id
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
    let answer = inquirer.prompt([
        {
            type: 'input',
            name: 'departmentName',
            message:'Please enter the new department name',
        }
    ]);
    db.query('INSERT INTO departments SET name=?', answer.departmentName);
    const addDepartment = db.query('SELECT * FROM departments');
    console.table(addDepartment);
    managerStart();
}

const addRole = () => {
    let answer = inquirer.prompt([
        {
            type: 'input',
            name: 'roleTitle',
            message:'Please enter the new role title',
        },
        {
            type: 'input',
            name: 'departmentID',
            message:'Please enter department ID',
        },
        {
            type: 'input',
            name: 'salary',
            message:'Please enter role salary',
        },
    ]);
    db.query('INSERT INTO roles SET title=?, department_id=?, salary=?', [
        answer.roleTitle,
        answer.departmentID,
        answer.salary,
    ]);
    console.table('New role added');
    managerStart();
}

const addEmployee = () => {
    let answer = inquirer.prompt([
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
    ]);
    db.query('INSERT INTO employees SET firstName=?, lastName=?, roleID=?, managerID=?', [
        answer.firstName,
        answer.lastName,
        answer.roleID,
        answer.managerID,
    ]);
    console.table('New employee added');
    managerStart();
}