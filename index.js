const taskInput = document.querySelector(".task-input input");
filters = document.querySelectorAll(".filters span");
taskBox = document.querySelector(".task-box");
clearAll = document.querySelector(".clear-btn");
let editId;
let isEditTask = false;

let toDo = JSON.parse(localStorage.getItem("todo-list"));

filters.forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelector("span.active").classList.remove("active");
        btn.classList.add("active");
        showToDo(btn.id);
    })
})

function showToDo(filter) {
    let li = "";
    if (toDo) {
        toDo.forEach((todoeach, id) => {
            let isCompleted = toDo.status == "completed" ? "checked" : "";

            if (filter == todoeach.status || filter == "all") {

                li +=
                    `
            <li class="task">
            <label for="${id}">
                <input type="checkbox" id="${id}" onclick="updateStatus(this)">
                <p class="${isCompleted}">${todoeach.name}</p>
            </label>
    
            <div class="settings">
                <i class="fa-solid fa-ellipsis" onclick="showMenu(this)"></i>
                <ul class="task-menu">
                    <li onclick="editTask(${id},'${todoeach.name}')"> <i class="fa-solid fa-pencil"></i>Edit</li>
                    <li onclick="deleteTask(${id})"> <i class="fa-solid fa-trash"></i>Delete</li>
                </ul>
            </div>
        </li>
            `
            }
        });
    }

    taskBox.innerHTML = li || `<span>You don't have any tasks</span>`;
}

showToDo("all");

function showMenu(selectedTask) {
    let taskMenu = selectedTask.parentElement.lastElementChild;
    taskMenu.classList.add("show");
    document.addEventListener("click", e => {
        if (e.target.tagName != "I" || e.target != selectedTask) {
            taskMenu.classList.remove("show")
        }
    })
}

function editTask(taskId, taskName) {
    editId = taskId;
    taskInput.value = taskName;
    isEditTask = true;
}


function deleteTask(deleteId) {
    toDo.splice(deleteId, 1);
    localStorage.setItem("todo-list", JSON.stringify(toDo));
    showToDo("all");
}

clearAll.addEventListener("click", ()=>{
    toDo.splice(0, toDo.length);
    localStorage.setItem("todo-list", JSON.stringify(toDo));
    showToDo("all");
})


function updateStatus(selectedTask) {
    let taskName = selectedTask.parentElement.lastElementChild;
    if (selectedTask.checked) {
        taskName.classList.add("checked");
        toDo[selectedTask.id].status = "completed"
    } else {
        taskName.classList.remove("checked")
        toDo[selectedTask.id].status = "pending"
    }
    localStorage.setItem("todo-list", JSON.stringify(toDo));
}

taskInput.addEventListener("keyup", (e) => {
    let userTask = taskInput.value.trim();

    if (e.key == "Enter" && userTask) {
        if (!isEditTask) {

            if (!toDo) {
                toDo = [];
            }
            let taskInfo = {
                name: userTask,
                status: "pending"
            };
            toDo.push(taskInfo);
        } else {
            toDo[editId].name = userTask;
            isEditTask = false;
        }
        taskInput.value = "";
        localStorage.setItem("todo-list", JSON.stringify(toDo));
        showToDo("all");
    }
})