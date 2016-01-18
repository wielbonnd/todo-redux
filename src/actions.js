export function setState (newState) {
    return {
        type: 'SET_STATE',
        newState
    };
}

export function switchDone (todoId) {
    return {
        type: 'SWITCH_DONE',
        todoId
    };
}

export function addTodo () {
    return {
        type: 'ADD_TODO',
    };
}

export function undo () {
    return {
        type: 'UNDO',
    };
}

export function dateChange (date) {
    return {
        type: 'DATE_CHANGE',
        date
    };
}

export function descriptionChange (description) {
    return {
        type: 'DESCRIPTION_CHANGE',
        description
    };
}
