"use strict";

import {create} from "./api.js"

const url = 'Group/get-all-groups';
const createGroupUrl = 'Group/create-group'

export function getAll() {

}

export function createNewGroup(group) {
    create(createGroupUrl, group)
        .catch((error) => console.log(error))
}