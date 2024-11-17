const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Define the file path 
const tasksFilePath = path.join(__dirname, 'tasks.json');

//  the tasks file exists
if (!fs.existsSync(tasksFilePath)) {
    fs.writeFileSync(tasksFilePath, JSON.stringify([]));
}

// Helper function 
const readTasks = () => {
    const data = fs.readFileSync(tasksFilePath, 'utf8');
    return JSON.parse(data);
};

// Helper function to write tasks 
const writeTasks = (tasks) => {
    fs.writeFileSync(tasksFilePath, JSON.stringify(tasks, null, 2));
};

// Create the readline interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

// Function to display the menu
const showMenu = () => {
    console.log(`
Task Manager:
1. Add a new task
2. View List
3. Mark a task as complete
4. Remove a task
5. Exit
`);
    rl.question('Choose an option: ', handleMenu);
};


const handleMenu = (choice) => {
    switch (choice.trim()) {
        case '1':
            rl.question('Enter the task description: ', (description) => {
                const tasks = readTasks();
                tasks.push({ description, completed: false });
                writeTasks(tasks);
                console.log('Task added successfully!');
                showMenu();
            });
            break;
        case '2':
            const tasks = readTasks();
            if (tasks.length === 0) {
                console.log('No tasks found.');
            } else {
                console.log('Tasks:');
                tasks.forEach((task, index) => {
                    console.log(
                        `${index + 1}. [${task.completed ? 'X' : ' '}] ${task.description}`
                    );
                });
            }
            showMenu();
            break;
        case '3':
            const tasksToComplete = readTasks();
            if (tasksToComplete.length === 0) {
                console.log('No tasks to mark as complete.');
                showMenu();
                return;
            }
            rl.question('Enter the task number to mark as complete: ', (num) => {
                const index = parseInt(num) - 1;
                if (tasksToComplete[index]) {
                    tasksToComplete[index].completed = true;
                    writeTasks(tasksToComplete);
                    console.log('Task marked as complete!');
                } else {
                    console.log('Invalid task number.');
                }
                showMenu();
            });
            break;
        case '4':
            const tasksToRemove = readTasks();
            if (tasksToRemove.length === 0) {
                console.log('No tasks to remove.');
                showMenu();
                return;
            }
            rl.question('Enter the task number to remove: ', (num) => {
                const index = parseInt(num) - 1;
                if (tasksToRemove[index]) {
                    tasksToRemove.splice(index, 1);
                    writeTasks(tasksToRemove);
                    console.log('Task removed successfully!');
                } else {
                    console.log('Invalid task number.');
                }
                showMenu();
            });
            break;
        case '5':
            console.log('Exiting Task Manager. Goodbye!');
            rl.close();
            break;
        default:
            console.log('Invalid option. Please try again.');
            showMenu();
            break;
    }
};


showMenu();
