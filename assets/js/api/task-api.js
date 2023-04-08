"use strict";

import {create} from "./api.js"

const url = "Task/create-task"

export function createNewTask(data) {
    create(url, data)
        .catch((error) => console.log(error));
}