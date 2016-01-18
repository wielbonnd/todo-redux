import * as Immutable from 'immutable';
import moment from 'moment';

const emptyState = Immutable.fromJS({
    todos: [],
    addForm: {
        date: {
            value: '',
            error: null
        },
        description: {
            value: '',
            error: null
        }
    },
    lastState: null
})

function saveState (state) {
    return state.update('lastState', () => state);
}

function setState (state, newState) {
    return state.merge(newState);
}

function undo (state) {
    var lastState = state.get('lastState');
    if (lastState) {
        return setState(state, lastState);
    } else {
        return state
    }
}

function validateDescription (description) {
    var err = null;
    if (description.length < 3) {
        err = 'Opis musi mieć minimum 3 znaki';
    }
    return err;
}

function validateDate (date) {
    var err = null;
    if (!moment(date, 'DD.MM.YYYY', true).isValid()) {
        err = 'Data '+ date + ' nie jest poprawną datą w formacie dd.mm.rrrr'
    }
    return err;
}

function dateChange (state, date) {
    var error = validateDate(date);
    state = state.updateIn(['addForm', 'date', 'error'], value => error);
    state = state.updateIn(['addForm', 'date', 'value'], value => date);
    return state;
}

function descriptionChange (state, description) {
    var error = validateDescription(description);
    state = state.updateIn(['addForm', 'description', 'error'], value => error);
    state = state.updateIn(['addForm', 'description', 'value'], value => description);
    return state;
}

var lastTodoId = 100;
function addTodo (state) {
    var date = state.getIn(['addForm', 'date', 'value']);
    var description = state.getIn(['addForm', 'description', 'value']);
    var dateError = validateDate(date);
    var descriptionError = validateDescription(description);
    state = state.updateIn(['addForm', 'date', 'error'], value => dateError);
    state = state.updateIn(['addForm', 'description', 'error'], value => descriptionError);
    if ( !dateError && !descriptionError ) {
        let todo = Immutable.Map({ id: lastTodoId, date: date, description: description });
        state = state.updateIn(['todos'], todos => todos.push(todo));
        lastTodoId++;
    }
    return state;
}

function switchDone (state, todoId) {
    var index = state.get("todos").findIndex( todo => todo.get('id') == todoId);
    if (index != -1) {
        return state.updateIn(['todos', index], todo => todo.update('done', done => !done ));
    } else {
        return state;
    }
}

export default function (state = emptyState, action) {
    switch (action.type) {
    case 'SET_STATE':
        return setState(state, action.newState);
    case 'SWITCH_DONE':
        return switchDone(saveState(state), action.todoId);
    case 'ADD_TODO':
        return addTodo(saveState(state));
    case 'UNDO':
        return undo(state);
    case 'DATE_CHANGE':
        return dateChange(state, action.date);
    case 'DESCRIPTION_CHANGE':
        return descriptionChange(state, action.description);
    }
    return state;
}
