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
                getExistingDepartments();
                break
            case 'Add an employee':
                getExistingRoles();
                break
            // case "update an employee role":
            //     getExistingEmployees()
            //     break
            // case "remove an existing employee":
            //     getExistingEmployeesForDelete()
            //     break
            // case "remove an existing department":
            //     getExistingDepartmentsForDelete()
            //     break
            // case "remove an existing role":
            //     getExistingRolesForDelete()
            //     break
            case "quit":
                db.end()
                break
        }
    })
};

const viewAllDep = () => {
    const deptQuery = 'SELECT * FROM departments;'
    db.query(deptQuery, (err, res) => {
        if (err) {
            console.log(err);
        } else {
            console.table(res);
            managerStart();
        }
    })
}