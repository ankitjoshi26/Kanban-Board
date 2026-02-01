const tasksData = {};
const todo = document.querySelector('#todo');
const progress = document.querySelector('#progress');
const done = document.querySelector('#done');
const toggleModalButton = document.querySelector("#toggle-modal");
const modal = document.querySelector(".modal");
const modalBg = document.querySelector(".modal .bg");
const addTaskButton = document.querySelector("#add-new-task");

let dragElement = null;

// Function to add a task to a column
function addTask(title, desc, column) {

    const div = document.createElement("div");
    div.classList.add("task");
    div.setAttribute("draggable", "true");

    div.innerHTML = `
        <h2>${title}</h2>
        <p>${desc}</p>
        <button>Delete</button>
    `;

    column.appendChild(div);

    // Drag start event
    div.addEventListener("dragstart", (e) => {
        dragElement = div;
    });

    // Drag end event to reset dragElement
    div.addEventListener("dragend", () => {
        dragElement = null;
    });

    // Delete task button
    const deleteButton = div.querySelector("button");
    deleteButton.addEventListener("click", (event) => {
        event.stopPropagation(); // Prevent event bubbling
        div.remove();
        updateTaskCount();
    });

    return div;
}

// Function to update task counts and save to localStorage
function updateTaskCount() {
    [todo, progress, done].forEach(col => {
        const tasks = col.querySelectorAll(".task");
        const count = col.querySelector(".right");

        // Update tasksData
        tasksData[col.id] = Array.from(tasks).map(t => ({
            title: t.querySelector("h2").innerText,
            desc: t.querySelector("p").innerText
        }));

        // Save to localStorage
        localStorage.setItem("tasks", JSON.stringify(tasksData));
        count.innerText = tasks.length;
    });
}

// Load tasks from localStorage on page load
if (localStorage.getItem("tasks")) {
    try {
        const data = JSON.parse(localStorage.getItem("tasks"));
        for (const col in data) {
                const column = document.querySelector(`#${col}`);
                    data[col].forEach(task => {
                            addTask(task.title, task.desc, column);
                    });
            }
        updateTaskCount();
    } catch (error) {
        console.error("Error loading tasks from localStorage:", error);
    }
}

// Function to add drag events to a column
function addDragEventsOnColumn(column) {
    column.addEventListener("dragenter", (e) => {
        e.preventDefault();
        column.classList.add("hover-over");
    });
    column.addEventListener("dragleave", (e) => {
        e.preventDefault();
        column.classList.remove("hover-over");
    });
    column.addEventListener("dragover", (e) => {
        e.preventDefault();
    });
    column.addEventListener("drop", (e) => {
        e.preventDefault();
            column.appendChild(dragElement);
            column.classList.remove("hover-over");
            updateTaskCount();
    });
}

// Add drag events to columns
addDragEventsOnColumn(todo);
addDragEventsOnColumn(progress);
addDragEventsOnColumn(done);

// Modal logic
toggleModalButton.addEventListener("click", () => {
    modal.classList.toggle("active");
});

modalBg.addEventListener("click", () => {
    modal.classList.remove("active");
});

addTaskButton.addEventListener("click", () => {
        const taskTitleInput = document.querySelector("#task-title-input");
        const taskDescInput = document.querySelector("#task-desc-input");

        const taskTitle = taskTitleInput.value.trim();
        const taskDesc = taskDescInput.value.trim();

        if (!taskTitle) {
            alert("Task title is required!");
            return;
        }

        if (!taskDesc) {
            alert("Task Description is required!");
            return;
        }

        addTask(taskTitle, taskDesc, todo);
        updateTaskCount();
        modal.classList.remove("active");
        taskTitleInput.value = "";
        taskDescInput.value = "";
});