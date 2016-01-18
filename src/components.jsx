import React from 'react';
import * as Immutable from 'immutable';
import {connect} from 'react-redux';
import * as actionCreators from './actions'

const UndoButton = React.createClass({
    render: function () {
        var disabled = this.props.lastState ? "" : "disabled";
        return <button type="submit" onClick={ () => this.props.undo() } disabled={disabled} className="btn btn-warning">Cofnij ostatnią akcję</button>
    }
})

const UndoButtonContainer = connect(
    function (state) {
        return {
            lastState: state.get('lastState')
        }
    },
    {
        undo: actionCreators.undo
    }
)(UndoButton);

const AddTodo = React.createClass({
    dateChange: function (event) {
        this.props.dateChange(event.target.value);
    },
    descriptionChange: function (event) {
        this.props.descriptionChange(event.target.value);
    },
    submit: function (event) {
        event.preventDefault();
        this.props.addTodo();
    },
    render: function () {
        var disabledSubmit = this.props.descriptionError || this.props.dateError  ? "disabled" : "";
        return <div className="col-md-3">
            <h3>Nowe przypomnienie</h3>
            <form onSubmit={this.submit} >
                <div className="form-group">
                    <input className="form-control" value={this.props.dateValue} name="date" onChange={this.dateChange} placeholder="Data w formacie dd.mm.yyyy" />
                    { this.props.dateError ? <strong className="text-danger" >{this.props.dateError}</strong> : "" }
                </div>
                <div className="form-group">
                    <input className="form-control" value={this.props.descriptionValue} onChange={this.descriptionChange} name="description" placeholder="Opis" />
                    { this.props.descriptionError ? <strong className="text-danger" >{this.props.descriptionError}</strong> : "" }
                </div>
                <button type="submit" disabled={disabledSubmit} className="btn btn-default pull-right">Dodaj</button>
            </form>
        </div>
    }
})

const AddTodoContainer = connect(
  function (state) {
        return {
            dateValue: state.getIn(['addForm', 'date', 'value']),
            dateError: state.getIn(['addForm', 'date', 'error']),
            descriptionValue: state.getIn(['addForm', 'description', 'value']),
            descriptionError: state.getIn(['addForm', 'description', 'error']),
        }
  },
  actionCreators
)(AddTodo);

const TodoItem = React.createClass({
    switch: function() {
        this.props.switchDone((this.props.id));
    },
    render: function () {
        var classes = "list-group-item";
        if (this.props.done) {
            classes = classes + " list-group-item-success";
        }
        return <a href="#" className={ classes } onClick={this.switch}>
            {this.props.date} {this.props.description}
            { this.props.done ? <span className="pull-right glyphicon glyphicon-ok" ></span> : "" }
        </a>
    }
})

const TodosList = React.createClass({
    render: function () {
        return <div className="col-md-9">
            <h3>Przypomnienia</h3>
            <div className="list-group">
                {this.props.todos.map(todo =>
                  <TodoItem key={todo.get('id')} id={todo.get('id')}
                   date={todo.get('date')} description={todo.get('description')}
                   done={todo.get('done')} switchDone={this.props.switchDone} />
                )}
            </div>
            <UndoButtonContainer />
        </div>
    }
})

const TodosListContainer = connect(
  function (state) {
    return {
        todos: state.get('todos')
    }
  },
  actionCreators
)(TodosList);

export const App = React.createClass({
    render: function () {
        return <div className="container">
            <TodosListContainer />
            <AddTodoContainer />
        </div>
    }
})
