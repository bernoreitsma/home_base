const taskList = document.getElementById('task-list');
const taskItems = Array.from(Array(taskList.childElementCount).keys());
let draggedItem = null;
let afterElement = null;

taskList.addEventListener('dragstart', (e) => {
    draggedItem = e.target;
    e.target.classList.add('dragging');
});

taskList.addEventListener('dragend', (e) => {
    e.target.classList.remove('dragging');
    draggedItem = null;
});

taskList.addEventListener('dragover', (e) => {
    e.preventDefault();
    afterElement = getDragAfterElement(taskList, e.clientY);
    if (afterElement == null) {
        taskList.insertBefore(draggedItem, taskList.lastElementChild);
    } else {
        taskList.insertBefore(draggedItem, afterElement);
    }
});

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('li:not(.dragging):not(.new-task-form)')];
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function fetchTaskOrderFromTaskList() {
    const children = Array.from(taskList.children);
    children.pop();
    const taskOrder = children.map((elt) => parseInt(elt.getAttribute("data-rank")));
    return taskOrder;
}

function setTaskListOrderAfterUpdate() {
    for (var i = 0; i < taskList.children.length; i++) {
        taskList.children[i].setAttribute("data-rank", i);
        taskList.children[i].children[0].textContent = `${i}.`;
    }
}

function setNewTaskOrder() {
    const taskOrder = fetchTaskOrderFromTaskList();
    fetch(
        "/tasks/api/update-order", {
        method: "POST",
        body: JSON.stringify({
            new_order: taskOrder
        }),
        headers: {
            "Content-Type": "application/json; charset=UTF-8",
        }
    }).then(
        setTaskListOrderAfterUpdate
    ).catch(
        (response) => {
            alert("Update failed with error", response.json())
        }
    );
    setTaskListOrderAfterUpdate();
};

document.getElementById("new-task-form")
    .addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const payload = {};
        const formData = new FormData(e.target)
        formData.forEach((value, key) => payload[key] = value);

        response = await fetch("/tasks/api/task", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });
        if (!response.ok) {
            alert("Error creating task: " + response.statusText);
            return;
        }
        updateTaskList(await response.json());
    });

function updateTaskList(response) {
    newItem = document.createElement("li");
    newItem.setAttribute("data-rank", response.rank);
    newItem.draggable = true;

    const strong = document.createElement("strong");
    strong.textContent = response.rank + '.';
    newItem.appendChild(strong);

    const description = document.createTextNode(' ' + response.description + ' ');
    newItem.appendChild(description);

    const icon = document.createElement("span");
    icon.setAttribute("class", "task-icon");
    icon.setAttribute("title", response.category.charAt(0).toUpperCase() + response.category.toLowerCase().slice(1))
    icon.setAttribute("style", "float:right; font-size:1.2rem;");
    icon.textContent = categoryToIcon(response.category);

    newItem.appendChild(icon);

    const status = document.createElement("span");
    status.setAttribute("style", "color: gray;");
    status.textContent = '(' + response.status + ')';
    
    newItem.appendChild(status);

    taskList.insertBefore(newItem, taskList.lastElementChild);
}

function categoryToIcon(category) {
    switch(category) {
        case "IMPORTANT":
            return "💼";
        case "FUN":
            return "🙂";
        case "SMALL":
            return "🤏";
        case "URGENT":
            return "🚨";
    }
}