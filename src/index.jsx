import 'bootstrap/dist/css/bootstrap.css';
import * as Immutable from 'immutable';
import React from 'react';
import ReactDOM from 'react-dom';
import {App} from './components'
import reducer from './reducers';
import {createStore} from 'redux';
import {Provider} from 'react-redux';

const store = createStore(reducer);

const initialData = Immutable.fromJS({
    todos: [
        {id: 1, date: "12.12.2015",  description: "Dapibus ac facilisis in", done: true},
        {id: 2, date: "02.02.2016",  description: "Morbi leo risus" }
    ]
})

store.dispatch({
    type: 'SET_STATE',
    newState: initialData
});

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('app')
);
