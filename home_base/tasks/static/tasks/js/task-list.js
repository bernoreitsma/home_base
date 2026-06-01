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
        taskList.appendChild(draggedItem);
    } else {
        taskList.insertBefore(draggedItem, afterElement);
    }
});

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('li:not(.dragging)')];
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
    const taskOrder = children.map((elt) => parseInt(elt.getAttribute("data-rank")));
    return taskOrder;
}

function setTaskListOrderAfterUpdate() {
    for (var i = 0; i < taskList.children.length; i++) {
        taskList.children[i].setAttribute("data-rank", i);
        taskList.children[i].children[0].textContent = `${i}`;
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