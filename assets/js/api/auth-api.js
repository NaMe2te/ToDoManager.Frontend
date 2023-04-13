"use strict";

import {register, login} from "./api.js"
import {closeAuth, makePageAfterLogin} from "../../../script.js";

const registrationUrl = "Account/register"
const loginUrl = "Account/login"


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
            console.log(statusCode, errorText);
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
            console.log(statusCode, errorText);
        });
}