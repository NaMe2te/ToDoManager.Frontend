"use strict";

const baseUrl = 'https://localhost:44307/api/';

function getRequest(url) {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', baseUrl + url, true);
        xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('token')}`);
        xhr.send();
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200)
                    resolve(xhr.responseText);
                else
                    reject(xhr.status, new Error(xhr.responseText));
            }
        }
    });
}

function getRequestWithData(url, data) {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        const urlWithParams = new URL(`${baseUrl}${url}`);
        urlWithParams.searchParams.append('id', data['id']);
        xhr.open('GET', urlWithParams.toString(), true);
        xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('token')}`);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send();
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200)
                    resolve(xhr.responseText);
                else
                    reject(xhr.status, new Error(xhr.responseText));
            }
        }
    });
}

function postRequest(url, date) {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open('POST', baseUrl + url, true);
        xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('token')}`);
        xhr.setRequestHeader('Content-Type', 'application/json');
        console.log(JSON.stringify(date));
        xhr.send(JSON.stringify(date));
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200)
                    resolve(xhr.responseText);
                else
                    reject(xhr.status, new Error(xhr.responseText));
            }
        }
    });
}

function deleteRequest(url, data) {
    return new Promise((resolve, reject)=> {
        let xhr = new XMLHttpRequest();
        const urlWithParams = new URL(`${baseUrl}${url}`);
        urlWithParams.searchParams.append('id', data['id']);
        xhr.open('DELETE', urlWithParams.toString(), true);
        xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('token')}`);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send();
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200)
                    resolve(xhr.responseText);
                else
                    reject(xhr.status, new Error(xhr.responseText));
            }
        }
    });
}

function putRequest(url, date) {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open('PUT', baseUrl + url, true);
        xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('token')}`);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(date));
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200)
                    resolve(xhr.responseText);
                else
                    reject(xhr.status, new Error(xhr.responseText));
            }
        }
    });
}


export function getAll(url) {
    return getRequest(url);
}

export function getAllWithData(url, data) {
    return getRequestWithData(url, data);
}

export function create(url, data) {
    return postRequest(url, data);
}

export function register(url, date) {
    return postRequest(url, date);
}

export function login(url, date) {
    return postRequest(url, date);
}

export function remove(url, data) {
    return deleteRequest(url, data);
}

export function update(url, data) {
    return putRequest(url, data);
}