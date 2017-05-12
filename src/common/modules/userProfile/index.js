const createAction = () => {};
// import { createAction } from 'utils';

// Action Types are namespaced since they are global
export const SHOW_TODOS = 'todos/SHOW_TODOS';
export const NEW_TODOS = 'todos/NEW_TODOS';
export const ADD_TODO = 'todos/ADD_TODO';
export const ADD_TODO_SUCCESS = 'todos/ADD_TODO_SUCCESS';
export const ADD_TODO_FAILURE = 'todos/ADD_TODO_FAILURE';

// Action Creators are in the same order as action types
export const todos = {
    showTodos: createAction(SHOW_TODOS),
    newTodos: createAction(NEW_TODOS),
    addTodo: createAction(ADD_TODO),
    addTodoSuccess: createAction(ADD_TODO_SUCCESS),
    addTodoFailure: createAction(ADD_TODO_FAILURE),
};

// Sagas
export * from './sagas/saveUserProfile';


const initialState = {};

// Reducer function is last, exported as default and
// will be used with in an App modules file combineReducers
export default function todosReducer(state = initialState, { type, payload }) {
    switch (type) {
        case SHOW_TODOS:
            return state.set('isVisible', true);

        case NEW_TODOS:
            return state
                .set('isVisible', true)
                .set('filterBy', 'new');

        case ADD_TODO:
            return state.set('isFetching', true);

        default:
            return state;
    }
}
