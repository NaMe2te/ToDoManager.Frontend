"use strict";

import {create, getAll, getAllWithData, remove, update} from "./api.js"

const createTaskUrl = "Task/create-task";
const getAllByGroupUrl = 'Task/get-tasks-by-group';
const getAllWithoutGroupUrl = 'Task/get-tasks-without-group';
const renameTaskUrl = 'Task/rename';
const addDeadlineUrl = 'Task/add-deadline';
const editTaskTextUrl = 'Task/edit-text';
const removeTaskUrl = 'Task/remove';
const changeStatusUrl = 'Task/change-status'

export function createNewTask(data, groupId) {
    create(createTaskUrl, data)
        .then(() => {
            if (groupId === null)
                getAllTasksWithoutGroup();
            else
                getAllTasksByGroup({
                    id: groupId
                });
        })
        .catch((error) => console.log(error));
}

export function getAllTasksByGroup(groupIdData) {
    getAllWithData(getAllByGroupUrl, groupIdData)
        .then((tasks) => {
            removeTasksFromListOnPage();
            const mainTitle = document.querySelector('.main__inner__title');
            mainTitle.textContent = `Tasks by group ${document.querySelector('.group__button__active').textContent}`;
            const groupTasks = JSON.parse(tasks);
            groupTasks.forEach(task => makeTaskEl(task));
        })
}

export function getAllTasksWithoutGroup() {
    getAll(getAllWithoutGroupUrl)
        .then((tasks) => {
            removeTasksFromListOnPage();
            const mainTitle = document.querySelector('.main__inner__title');
            mainTitle.textContent = 'Tasks';
            const taskWithoutGroup = JSON.parse(tasks);
            taskWithoutGroup.forEach(task => makeTaskEl(task));
        })
}

export function removeTasksFromListOnPage() {
    const mainTaskArea = document.querySelector('.main__task__area');
    mainTaskArea.replaceChildren();
}

export function addDeadline(taskId) {
    const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
    const deadlineArea = taskElement.querySelector('.task__deadline');
    const input = document.createElement('input');
    input.classList.add('form__input');
    input.type = 'datetime-local';
    const firstDeadline = deadlineArea.textContent;
    deadlineArea.textContent = '';
    deadlineArea.appendChild(input);
    input.focus();

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const newDate = input.value.substring(0, 10);
            if (newDate === "")
                deadlineArea.textContent = firstDeadline;
            else {
                deadlineArea.textContent = newDate;
                saveDeadlineTask(taskId, newDate);
            }
        } else if (e.key === 'Escape') {
            deadlineArea.textContent = firstDeadline;
        }

        if (deadlineArea.contains(input))
            deadlineArea.removeChild(input);
    });

    input.addEventListener('blur', (e) => {
        e.preventDefault();
        const newDate = input.value.substring(0, 10);
        if (newDate === "")
            deadlineArea.textContent = firstDeadline;
        else {
            deadlineArea.textContent = newDate;
            saveDeadlineTask(taskId, newDate);
        }

        if (deadlineArea.contains(input))
            deadlineArea.removeChild(input);
    });

    function saveDeadlineTask(taskId, newDate) {
        update(addDeadlineUrl, {
            taskId: taskId,
            newDate: new Date(newDate)
        }).catch((statusCode, error) => {
            console.log(statusCode + " " + error);
        });
    }
}

export function renameTask(taskId) {
    const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
    const taskName = taskElement.querySelector('.task__name');
    const input = document.createElement('input');
    input.classList.add('form__input');
    input.type = 'text';
    const firstName = taskName.textContent;
    input.value = firstName;
    input.style.color = '#e4e4e4';
    input.style.fontSize = '15px';
    input.classList.add('task__name');
    taskName.textContent = '';
    taskName.appendChild(input);
    input.focus();

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const newName = input.value.trim();
            if (newName === "") {
                taskName.textContent = firstName;
            } else {
                taskName.textContent = newName;
                saveRenamedTask({
                    taskId: taskId,
                    newName: newName
                })
            }

            if (taskName.contains(input)) {
                taskName.removeChild(input);
            }
        } else if (e.key === 'Escape') {
            taskName.textContent = firstName;

            if (taskName.contains(input)) {
                taskName.removeChild(input);
            }
        }
    });

    input.addEventListener('blur', () => {
        const newName = input.value.trim();
        if (newName === "")
            taskName.textContent = firstName;
        else {
            taskName.textContent = newName;
            saveRenamedTask({
                taskId: taskId,
                newName: newName
            })
        }

        if (taskName.contains(input)) {
            taskName.removeChild(input);
        }
    });

    function saveRenamedTask(data) {
        update(renameTaskUrl, data)
            .catch((statusCode, error) => {
                console.log(statusCode + " " + error);
            })
    }
}

export function editTaskText(taskId) {
    const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
    const taskName = taskElement.querySelector('.task__text');
    const input = document.createElement('input');
    input.classList.add('form__input');
    input.type = 'text';
    const firstName = taskName.textContent;
    input.value = firstName;
    input.style.color = '#e4e4e4';
    input.style.fontSize = '15px';
    taskName.textContent = '';
    taskName.appendChild(input);
    input.focus();

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const newName = input.value.trim();
            if (newName === "") {
                taskName.textContent = firstName;
            } else {
                taskName.textContent = newName;
                saveEditTaskText({
                    taskId: taskId,
                    newText: newName
                })
            }

            if (taskName.contains(input)) {
                taskName.removeChild(input);
            }
        } else if (e.key === 'Escape') {
            taskName.textContent = firstName;

            if (taskName.contains(input)) {
                taskName.removeChild(input);
            }
        }
    });

    input.addEventListener('blur', () => {
        const newName = input.value.trim();
        if (newName === "")
            taskName.textContent = firstName;
        else {
            taskName.textContent = newName;
            saveEditTaskText({
                taskId: taskId,
                newText: newName
            })
        }

        if (taskName.contains(input)) {
            taskName.removeChild(input);
        }
    });

    function saveEditTaskText(data) {
        update(editTaskTextUrl, data)
            .catch((statusCode, error) => {
                console.log(statusCode + " " + error);
            })
    }
}

export function removeTask(data) {
    remove(removeTaskUrl, data)
        .then(() => {
            let activeGroup = document.querySelector('.group__button__active');
            if (activeGroup === null)
                getAllTasksWithoutGroup();
            else
                getAllTasksByGroup({
                    id: activeGroup.dataset['groupId']
                });
        })
        .catch((status, error) => {
            console.log(status + ' ' + error);
        });
}

function makeTaskEl(task) {
    const taskWrapper = createTaskWrapper(task);
    const divTask = document.createElement('div');
    divTask.classList.add('task');
    taskWrapper.appendChild(divTask);
    const checkboxCenterWrapper = createCheckboxCenterWrapper();
    divTask.appendChild(checkboxCenterWrapper);
    const checkboxWrapper = createCheckboxWrapper(task['id']);
    checkboxCenterWrapper.appendChild(checkboxWrapper);
    const taskCenterWrapper = createTaskCenterWrapper(task);
    checkboxCenterWrapper.appendChild(taskCenterWrapper);
    const taskDeadline = createTaskDeadline(task);
    divTask.appendChild(taskDeadline);

    function createTaskWrapper(task) {
        const mainTaskArea = document.querySelector('.main__task__area');
        const label = document.createElement('label');
        label.style.cursor = 'pointer';
        const taskWrapper = document.createElement('div');
        taskWrapper.classList.add('task__wrapper');
        taskWrapper.dataset.taskId = task['id'];
        mainTaskArea.appendChild(label);
        label.appendChild(taskWrapper);
        return taskWrapper;
    }

    function createCheckboxCenterWrapper() {
        const checkboxCenterWrapper = document.createElement('div');
        checkboxCenterWrapper.classList.add('checkbox__center__wrapper');
        return checkboxCenterWrapper;
    }

    function createCheckboxWrapper(taskId) {
        const checkboxWrapper = document.createElement('div');
        checkboxWrapper.classList.add('checkbox__wrapper');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.classList.add('task__checkbox');
        checkboxWrapper.appendChild(checkbox);
        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                changeTaskStatus({
                    taskId: taskId,
                    status: true
                });
            } else {
                changeTaskStatus({
                    taskId: taskId,
                    status: false
                });
            }
        });
        return checkboxWrapper;
    }

    function createTaskCenterWrapper(task) {
        const taskCenterWrapper = document.createElement('div');
        taskCenterWrapper.classList.add('task__center__wrapper');
        const taskName = document.createElement('div');
        taskName.classList.add('task__name');
        taskName.textContent = task['name'];
        const taskText = document.createElement('div');
        taskText.classList.add('task__text');
        taskText.textContent = task['text'];
        taskCenterWrapper.appendChild(taskName);
        taskCenterWrapper.appendChild(taskText);
        return taskCenterWrapper;
    }

    function createTaskDeadline(task) {
        const taskDeadline = document.createElement('div');
        taskDeadline.classList.add('task__deadline');
        if (task['deadline'] != null)
            taskDeadline.textContent = task['deadline'].substring(0, 10);
        return taskDeadline;
    }

    function changeTaskStatus(data) {
        update(changeStatusUrl, data)
            .catch((statusCode, error) => {
                console.log(statusCode + " " + error);
            });
    }
}
