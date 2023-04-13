"use strict";

import {create, getAll, remove, update} from "./api.js";
import {getAllTasksByGroup, getAllTasksWithoutGroup} from "./task-api.js";

const getAllGroupUrl = 'Group/get-all';
const createGroupUrl = 'Group/create';
const deleteGroupUrl = 'Group/remove';
const renameGroupUrl = 'Group/rename'

export function getAllGroups() {
    getAll(getAllGroupUrl)
        .then((jsonGroups) => {
            const groups = JSON.parse(jsonGroups);
            groups.forEach(group => {
                makeGroupEl(group);
            });

            function makeGroupEl(group) {
                const burgerList = document.querySelector('.burger__list');
                const newGroup = document.createElement('div');
                newGroup.classList.add('group');
                newGroup.dataset.groupId = group['id'];
                newGroup.textContent = group['name'];
                burgerList.appendChild(newGroup);
            }
        })
        .catch(() => {

        });
}

export function createNewGroup(group) {
    create(createGroupUrl, group)
        .then(() => {
            removeGroupsFromListOnPage();
            getAllGroups();
        })
        .catch((error) => console.log(error))
}

export function removeGroupsFromListOnPage() {
    const burgerList = document.querySelector('.burger__list');
    burgerList.replaceChildren();
}

export function removeGroup(data) {
    remove(deleteGroupUrl, data)
        .then(() => {
            removeGroupsFromListOnPage();
            getAllGroups();
        })
        .catch((status, error) => {
             console.log(status + ' ' + error);
        });
}

export function renameGroup(groupId) {
    const groupElement = document.querySelector(`[data-group-id="${groupId}"]`);
    const input = document.createElement('input');
    if (groupElement.classList.contains('group__button__active'))
        input.classList.add('form__input__addtask');
    input.classList.add('form__input');
    input.type = 'text';
    const firstName = groupElement.textContent;
    input.style.fontSize = '20px';
    input.value = firstName;
    groupElement.textContent = '';
    groupElement.appendChild(input);
    input.focus();

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const newName = input.value.trim();
            if (newName === "") {
                groupElement.textContent = firstName;
            } else {
                groupElement.textContent = newName;
                saveRenamedGroup({
                    "id": groupId,
                    "newName": newName
                })
            }

            if (groupElement.contains(input)) {
                groupElement.removeChild(input);
            }
        } else if (e.key === 'Escape') {
            groupElement.textContent = firstName;

            if (groupElement.contains(input)) {
                groupElement.removeChild(input);
            }
        }
    });

    input.addEventListener('blur', () => {
        const newName = input.value.trim();
        if (newName === "")
            groupElement.textContent = firstName;
        else {
            groupElement.textContent = newName;
            saveRenamedGroup({
                "id": groupId,
                "newName": newName
            })
        }

        if (groupElement.contains(input)) {
            groupElement.removeChild(input);
        }
    });

    function saveRenamedGroup(data) {
        update(renameGroupUrl, data)
            .catch((statusCode, error) => {
                console.log(statusCode + " " + error);
            })
    }
}