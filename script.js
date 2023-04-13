"use strict";

import {
    addDeadline,
    createNewTask,
    editTaskText, getAllTasksByGroup, getAllTasksWithoutGroup, removeTask,
    removeTasksFromListOnPage,
    renameTask
} from "./assets/js/api/task-api.js";
import {
    createNewGroup,
    getAllGroups,
    removeGroup,
    removeGroupsFromListOnPage,
    renameGroup
} from "./assets/js/api/group-api.js";
import {enter, makeRegistration} from "./assets/js/api/auth-api.js";

document.querySelector('.burger__button')
    .addEventListener('click', (e) => {
    e.preventDefault();
    const burBtn = document.querySelector('.burger__button');
    burBtn.classList.toggle("burger__button__active");
    const burMenu = document.querySelector('.burger__menu');
    burMenu.classList.toggle('burger__menu__active');
});

const datetime = document.querySelector('input[type="datetime-local"]');
const current = new Date().toISOString().slice(0, 16);
datetime.setAttribute('min', current);


document.querySelector('#addtask__plus__button')
    .addEventListener('click', (e) => {
    e.preventDefault();
    const addTaskForm = document.querySelector('#addtask__form__inner');
    let formData = new FormData(addTaskForm);
    let taskName = formData.get('task_name');
    let text = formData.get('text');
    if (!taskName || taskName.trim() === "" || !text || text.trim() === "") {
        document.querySelector('.add__task__inner').classList.add('input__error');
        addTaskForm.reset();
        return;
    }

    let groupId = null;
    if (document.querySelector('.group__button__active') !== null)
        groupId = document.querySelector('.group__button__active').dataset['groupId'];

    createNewTask({
        name: taskName,
        text: text,
        deadline: formData.get('deadline') ? formData.get('deadline') : null,
        groupId: groupId
    }, groupId);
    addTaskForm.reset();
});



document.querySelector('#addgroup__plus__button')
    .addEventListener('click', (e) => {
    e.preventDefault();
    const addGroupForm = document.querySelector('#addgroup__form__inner');
    let formData = new FormData(addGroupForm);
    let grName = formData.get('group_name');
    if (!grName || grName.trim() === "") {
        document.querySelector('.add__group__inner').classList.add('input__error');
        addGroupForm.reset();
        return;
    }

    createNewGroup({groupName: grName})
    addGroupForm.reset();
});


document.querySelectorAll('.form__input__addtask').forEach((el) => {
    el.addEventListener('focus', (e) => {
        e.preventDefault();
        let formInner = document.querySelector('.add__task__inner');
        if (formInner.classList.contains('input__error'))
            formInner.classList.remove('input__error');
    });
});


document.querySelector('#group_name').addEventListener('focus', (e) => {
    e.preventDefault();
    let formInner = document.querySelector('.add__group__inner');
    if (formInner.classList.contains('add__group__inner'))
        formInner.classList.remove('input__error');
});


const authButton = document.querySelector('.auth__button');
authButton.addEventListener('click', loginOrSignup);


const signUpOrLoginButton = document.querySelector('.sign__up');
signUpOrLoginButton.addEventListener('click', (e) => {
    e.preventDefault();
    let question = document.querySelector('.sign__up__question');
    if (authButton.classList.contains('auth__button__login')) {
        authButton.classList.remove('auth__button__login');
        authButton.classList.add('auth__button__register');
        signUpOrLoginButton.textContent = 'Log In';
        authButton.textContent = 'Sign up';
        question.textContent = 'Have an account already?';
    } else {
        authButton.classList.remove('auth__button__register');
        authButton.classList.add('auth__button__login');
        signUpOrLoginButton.textContent = 'Sign up';
        authButton.textContent = 'Log In';
        question.textContent = 'Don\'t have an account?';
    }
});

const burgerMenu = document.querySelector('.burger__menu');
burgerMenu.addEventListener('click', (e) => {
    const button = e.target;
    if (!button.classList.contains('group'))
        return;

    if (button.classList.contains('group__button__active')) {
        button.classList.remove('group__button__active');
        getAllTasksWithoutGroup();
        return;
    } else {
        getAllTasksByGroup({id: parseInt(e.target.dataset['groupId'])});
    }

    const buttonGroupList = burgerMenu.querySelectorAll('.group');
    buttonGroupList.forEach(group => {
        if (group.classList.contains('group__button__active'))
            group.classList.remove('group__button__active');
    });

    button.classList.add('group__button__active');
});

burgerMenu.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    const button = e.target;
    if (!button.classList.contains('group'))
        return;

    groupRightClickOpen(e);
});

const mainTaskArea = document.querySelector('.task__scroll');
mainTaskArea.addEventListener('contextmenu', (event) => {
    const taskWrapper = event.target.closest('.task__wrapper');
    if (taskWrapper) {
        event.preventDefault();
        taskId = taskWrapper.dataset['taskId'];
        taskRightClickOpen(event);
    }
});

let groupId = null,
    taskId = null;

function groupRightClickOpen(event) {
    const rightClickWrapper = document.querySelector('.group__right__click');
    const x = event.clientX;
    const y = event.clientY;
    const parentElement = event.target.parentNode;
    const parentRect = parentElement.getBoundingClientRect();
    rightClickWrapper.style.left = `${x - parentRect.left}px`;
    rightClickWrapper.style.top = `${y - parentRect.top}px`;
    rightClickWrapper.style.visibility = 'visible';
    groupId = event.target.dataset['groupId'];
}

function taskRightClickOpen(event) {
    const parentRect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - parentRect.left + 250;
    const y = event.clientY - parentRect.top;
    const rightClickWrapper = document.querySelector('.task__right__click');
    rightClickWrapper.style.left = `${x}px`;
    rightClickWrapper.style.top = `${y}px`;
    rightClickWrapper.style.visibility = 'visible';
}

window.addEventListener('click', (e) => {
    document.querySelectorAll('.right__click__wrapper').forEach(x => x.style.visibility = 'hidden');
});

document.querySelector('.group__right__click').querySelectorAll('li')
    .forEach(li => {
        li.addEventListener('click', (e) => {
            if (li.classList.contains('rename__item')) {
                renameGroup(groupId);
            } else if (li.classList.contains('delete__item')) {
                removeGroup({
                    id: groupId
                });
            }
        });
    });

document.querySelector('.task__right__click').querySelectorAll('li')
    .forEach(li => {
        li.addEventListener('click', (e) => {
            if (li.classList.contains('add__deadline__to__item')) {
                addDeadline(taskId);
            } else if (li.classList.contains('rename__item')) {
                renameTask(taskId);
            } else if (li.classList.contains('edit__item__text')) {
                editTaskText(taskId);
            } else if (li.classList.contains('delete__item')) {
                removeTask({
                    "id": taskId
                });
            }
        });
    });


const headerLoginButton = document.querySelector('.header__profile__button');
function loginOrSignup(e) {
    e.preventDefault();
    let authForm = document.querySelector('#auth__form');
    let formData = new FormData(authForm);
    let authUsername = formData.get('username');
    let authPassword = formData.get('password');
    if ((!authUsername || authUsername.trim() === "") || (!authPassword || authPassword.trim() === "")) {
        const inputs = authForm.querySelectorAll('input');
        inputs.forEach((input) => {
            input.classList.add('input__error');
            console.log(input.textContent);
        });
        authForm.reset();
        return;
    }

    if (authButton.classList.contains('auth__button__login')) {
        enter({
            username: authUsername,
            password: authPassword
        });
    } else {
        makeRegistration({
            username: authUsername,
            password: authPassword
        });
    }
    authForm.reset();
}


document.querySelector('.close__auth').addEventListener('click', closeAuth);

export function closeAuth() {
    document.querySelector('.auth-bg').classList.add('auth-bg__nonactive');
}

function openAuth() {
    document.querySelector('.auth-bg').classList.remove('auth-bg__nonactive');
}

function makePageAfterLogout() {
    removeGroupsFromListOnPage();
    removeTasksFromListOnPage();
    headerLoginButton.textContent = 'LogIn';
    headerLoginButton.removeEventListener('click', makePageAfterLogout);
    headerLoginButton.addEventListener('click', openAuth);
    localStorage.removeItem('token');
    const groupTitle = document.querySelector('.burger__menu__title');
    groupTitle.textContent = 'You should LogIn to see your groups';
    const mainTitle = document.querySelector('.main__inner__title');
    mainTitle.textContent = 'You should LogIn to see your tasks';
}



export function makePageAfterLogin() {
    getAllGroups();
    getAllTasksWithoutGroup();
    const groupTitle = document.querySelector('.burger__menu__title');
    groupTitle.textContent = 'Groups';
    headerLoginButton.textContent = 'LogOut';
    headerLoginButton.addEventListener('click', makePageAfterLogout);
    headerLoginButton.removeEventListener('click', openAuth);
}


(() => {
    if (localStorage.getItem('token')) {
        makePageAfterLogin();
    } else {
        makePageAfterLogout();
    }
})();
