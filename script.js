"use strict";

import {createNewTask} from "./assets/js/api/task-api.js";
import {createNewGroup} from "./assets/js/api/group-api.js";
import {enter, getAccountId, makeRegistration} from "./assets/js/api/auth-api.js";

let btn = document.querySelector('.burger__button');
btn.addEventListener('click', (e) => {
    e.preventDefault();
    const burBtn = document.querySelector('.burger__button');
    burBtn.classList.toggle("burger__button__active");
    const burMenu = document.querySelector('.burger__menu');
    burMenu.classList.toggle('burger__menu__active');
});

const datetime = document.querySelector('input[type="datetime-local"]');
const current = new Date().toISOString().slice(0, 16);
datetime.setAttribute('min', current);

const addTaskButton = document.querySelector('#addtask__plus__button');
addTaskButton.addEventListener('click', (e) => {
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

    createNewTask({
        name: taskName,
        text: text,
        deadline: formData.get('deadline') ? formData.get('deadline') : null,
        groupId: null
    });
    addTaskForm.reset();
});


const addGroupButton = document.querySelector('#addgroup__plus__button');
addGroupButton.addEventListener('click', (e) => {
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

const addTaskInputs = document.querySelectorAll('.form__input__addtask');
addTaskInputs.forEach((el) => {
    el.addEventListener('focus', (e) => {
        e.preventDefault();
        let formInner = document.querySelector('.add__task__inner');
        if (formInner.classList.contains('input__error'))
            formInner.classList.remove('input__error');
    });
});

const addGroupInput = document.querySelector('#group_name');
addGroupInput.addEventListener('focus', (e) => {
    e.preventDefault();
    let formInner = document.querySelector('.add__group__inner');
    if (formInner.classList.contains('add__group__inner'))
        formInner.classList.remove('input__error');
});


const authButton = document.querySelector('.auth__button');
authButton.addEventListener('click', loginOrSignup);

const signUpButton = document.querySelector('.sign__up');
signUpButton.addEventListener('click', (e) => {
    e.preventDefault();
    let question = document.querySelector('.sign__up__question');
    if (authButton.classList.contains('auth__button__login')) {
        authButton.classList.remove('auth__button__login');
        authButton.classList.add('auth__button__register');
        signUpButton.textContent = 'Log In';
        authButton.textContent = 'Sign up';
        question.textContent = 'Have an account already?';
    } else {
        authButton.classList.remove('auth__button__register');
        authButton.classList.add('auth__button__login');
        signUpButton.textContent = 'Sign up';
        authButton.textContent = 'Log In';
        question.textContent = 'Don\'t have an account?';
    }
});

const headerLoginButton = document.querySelector('.header__profile__button');

function loginOrSignup() {
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

const closeAuthButton = document.querySelector('.close__auth');
closeAuthButton.addEventListener('click', closeAuth);

export function closeAuth() {
    const auth = document.querySelector('.auth-bg');
    if (!auth.classList.contains('auth-bg__nonactive')) {
        auth.classList.add('auth-bg__nonactive');
    }
}

function openAuth() {
    const auth = document.querySelector('.auth-bg');
    if (auth.classList.contains('auth-bg__nonactive')) {
        auth.classList.remove('auth-bg__nonactive');
    }
}

function logout() {
    headerLoginButton.textContent = 'LogIn';
    headerLoginButton.removeEventListener('click', logout);
    headerLoginButton.addEventListener('click', openAuth);
    localStorage.removeItem('token');
    const groupTitle = document.querySelector('.burger__menu__title');
    groupTitle.textContent = 'You should to LogIn to see your groups';
    const mainTitle = document.querySelector('.main__inner__title');
    mainTitle.textContent = 'You should to LogIn to see your tasks';
}



export function makePageAfterLogin() {
    const groupTitle = document.querySelector('.burger__menu__title');
    const mainTitle = document.querySelector('.main__inner__title');
    groupTitle.textContent = 'Your groups:';
    mainTitle.textContent = '1';
    headerLoginButton.textContent = 'LogOut';
    headerLoginButton.addEventListener('click', logout);
}

export function makePageAfterLogout() {
    const groupTitle = document.querySelector('.burger__menu__title');
    const mainTitle = document.querySelector('.main__inner__title');
    groupTitle.textContent = 'You should to LogIn to see your groups';
    mainTitle.textContent = 'You should to LogIn to see your tasks';
    headerLoginButton.textContent = 'LogIn';
    headerLoginButton.addEventListener('click', openAuth);
}

/*enter({
        username: 'владпупкин',
        password: '123'
    });*/

// getAccountId();

(() => {
    if (localStorage.getItem('token')) {
        makePageAfterLogin();
    } else {
        makePageAfterLogout();
    }
})();



