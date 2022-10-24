require('dotenv').config();
const connection = require('./config/connections');
const mysql2 = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');
const figlet = require('figlet');


connection.connect((err) => {
    if (err) throw err;
    console.log(`You are connected to the Database`)
    figlet('Employee Tracker', (err, data) => {
        if (err) {
            console.log('Employee Tracker ART NOT LOADED')
        } else {
            console.log(data);
        }
        beginTracker();
    
    });
});



function beginTracker() {
    const firstAction = [{
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: ['View All Departments','View All Employees','View All Roles',
        'Add Department','Add Employee','Add Role','Update Employee Role', 'Exit'],
        loop: false
        
    }]

    inquirer.prompt(firstAction)
    .then(function(answers) {
        switch (answers.action) {
            case 'View All Departments': viewAll('DEPARTMENT');
                break;
            case 'View All Roles': viewAll('ROLE');
                break;
            case 'View All Employees': viewAll('EMPLOYEE');
                break;
            case 'Add Department': addNewDepartment();
                break
            case 'Add Employee': addNewEmployee();
                break;
            case 'Add Role': addNewRole();
                break;
            case 'Update Employee Role': updateRole();
                break;
            default: thankYou();
            
        }
    })
    .catch(err => {
        console.error(err);
    });

    const viewAll = (table) => {
        let query;
        if (table === 'DEPARTMENT') {
            query = `SELECT * FROM departments;`;
            console.log(query);
        } else if (table === 'ROLE') {
            query = `SELECT * FROM roles;`;
            console.log(query);
        } else {
            query = `SELECT * FROM employees;`
            console.log(query);
        }
        connection.query(query, (err, res) => {
            if (err) throw err;
            console.table(res);
    
            beginTracker();
        });
    };

    function addNewDepartment() {
        let newDepartment = [{
            type: 'input',
            name: 'name',
            message: 'What department would you like to add?'
        }];

        inquirer.prompt(newDepartment)
        .then(answers => {
            let query = `INSERT INTO departments (name) VALUES (?);`
            connection.query(query, [answers.name], (err, res) => {
                if (err) throw err;
                console.log(`${answers.name} was added as a new department`);
                beginTracker();
            });
        }).catch(err => {
            console.error(err);
        });
    }

    function addNewEmployee(){
        connection.query('SELECT * FROM employees;', (err, empRes) => {
            if (err) throw err;
            let managerChoice = [
                {
                    name: 'None',
                    value: 0
                }
            ];
            empRes.forEach(({ first_name, last_name, id }) => {
                managerChoice.push(
                    {
                        name: first_name + ' ' + last_name,
                        value: id
                    }
                )
            });

            connection.query('SELECT * FROM roles;', (err, roleRes) => {
                if (err) throw err;
                let rolePick = [];
                roleRes.forEach(({title, id}) => {
                    rolePick.push(
                        {
                            name: title,
                            value: id
                        }
                    )
                });

            let employeeQuestions = [
                {
                    type: 'input',
                    name: 'first_name',
                    message: 'What is the first name of the employee?'
                },
                {
                    type: 'input',
                    name: 'last_name',
                    message: 'What is the last name of the employee?'
                },
                {
                    type: 'list',
                    name: 'role_choice',
                    choices: rolePick,
                    message: 'Select the role of the employee'
                },
                {
                    type: 'list',
                    name: 'manager_choice',
                    choices: managerChoice,
                    message: 'Who is the manager of the employee?'
                }
            ]

            inquirer.prompt(employeeQuestions)
            .then(answers => {
                let query = `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?);`;
                let manager_id = answers.manager_id;
                connection.query(query, [[answers.first_name, answers.last_name, answers.role_choice, manager_id]], (err, res) => {
                    if (err) throw err;
                    console.log(`${answers.first_name} ${answers.last_name} has been added as an employee`);
                    beginTracker();
                });
            }).catch(err => {
                console.error(err);
            })

            })
        })
    }

    function addNewRole() {

        let departments = [];
        connection.query('SELECT * FROM departments;', (err, res) => {
            if (err) throw err;
            res.forEach(depart => {
                let chooseDepart = {
                    name: depart.name,
                    value: depart.id
                };
                departments.push(chooseDepart);
                })
            })

        let newRole = [
            {
                type: 'input',
                name: 'title',
                message: 'What role would you like to add?'
            },
            {
                type: 'input',
                name: 'salary',
                message: 'What is the salary of the role?'
            },
            {
                type: 'list',
                name: 'department',
                choices: departments,
                message: 'Which department would you like the role to be in?'
            }
        ];

        inquirer.prompt(newRole)
        .then(answers => {
            let query = `INSERT INTO roles (title, salary, department_id) VALUES(?);`;
            connection.query(query, [[answers.title, answers.salary, answers.department]],
                (err, res) => {
                    if (err) throw err;
                    console.log(`${answers.title} has been added as a new role`);
                    beginTracker();
                });
        }).catch (err => {
            console.error(err);
        })
        }

    function updateRole() {

        connection.query('SELECT * FROM employees;', (err, empRes) => {
            if (err) throw err;
            let employeePick = [];
            empRes.forEach(({ first_name, last_name, id }) => {
                employeePick.push(
                    {
                        name: first_name + ' ' + last_name,
                        value: id
                    }
                );
            });

        connection.query('SELECT * FROM roles;', (err, roleRes) => {
            if (err) throw err;
            let roleChoice = [];
            roleRes.forEach(({ title, id }) => {
                roleChoice.push(
                    {
                        name: title,
                        value: id
                    }
                );
            });

        let updateRoleQuestions = [
            {
                type: 'list',
                name: 'emp_id',
                choices: employeePick,
                message: 'Which employee\'s role would you like to update?' 
            },
            {
                type: 'list',
                name: 'role_id',
                choices: roleChoice,
                message: 'What is the employee\'s new role?'
            }
        ]

        inquirer.prompt(updateRoleQuestions)
        .then(answers => {
            let query = `UPDATE employees SET ? WHERE ? = ?;`;
            connection.query(query, [
                {
                    role_id: answers.role_id
                },
                'id',
                answers.id
            ], (err, res) => {
                if (err) throw err;
                console.log('The employee\'s role has been successfully updated');
                beginTracker();
            });
        }).catch(err => {
            console.error(err);
        })

        })

        })
    }

    function thankYou() {
        figlet('Have a Good Day!', (err, data) =>{
            if (err) {
                console.log('Have a Good Day ART NOT LOADED')
            } else {
                console.log(data);
            }
            connection.end();
        
        });
    }

}

