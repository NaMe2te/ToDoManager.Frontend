"use strict";

import {register, login} from "./api.js"
import {addErrorText, closeAuth, makePageAfterLogin} from "../../../script.js";

const registrationUrl = "Account/register"
const loginUrl = "Account/login"

const authForm = document.querySelector('#auth__form'),
    inputs = authForm.querySelectorAll('input');

export function makeRegistration(usernameAndPassword) {
    register(registrationUrl, usernameAndPassword)
        .then((token) => {
            console.log(token);
            const tok = JSON.parse(token);
            localStorage.setItem('token', tok['token']);
            makePageAfterLogin();
            closeAuth();
        })
        .catch((statusCode, errorText) => {
            if (statusCode === 409) {
                inputs[0].classList.add('input__error');
                addErrorText("Username already exist");
            }
        });
}

export function enter(usernameAndPassword) {
    login(loginUrl, usernameAndPassword)
        .then((token) => {
            console.log(token);
            const tok = JSON.parse(token);
            localStorage.setItem('token', tok['token']);
            makePageAfterLogin();
            closeAuth();
        })
        .catch((statusCode, errorText) => {
            if (statusCode === 401) {
                const authForm = document.querySelector('#auth__form'),
                    inputs = authForm.querySelectorAll('input');
                inputs.forEach(input => {
                    input.classList.add('input__error');
                });
                addErrorText("Invalid username or password");
            }
        });
}