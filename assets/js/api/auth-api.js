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
        })
        .catch((statusCode, errorText) => {
            if (statusCode === 409)
                console.log(errorText);
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
            if (statusCode === 401)
                console.log(errorText);
        });
}

function loadGroups() {

}

export function getAccountId() {
    const token = localStorage.getItem('token');
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    const user = JSON.parse(jsonPayload);
    console.log(user);
    console.log(user['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/sid']);
}