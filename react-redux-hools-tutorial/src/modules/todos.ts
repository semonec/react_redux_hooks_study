// Action type
const ADD_TODO = 'todos/ADD_TODO' as const;
const TOGGLE_TODO = 'todos/TOGGLE_TODO' as const;
const REMOVE_TODO = 'todos/REMOVE_TODO' as const;

// Action creator
export const addTodo = (text: string) => ({
    type: ADD_TODO,
    payload: text
});

export const toggleTodo = (id: number) => ({
    type: TOGGLE_TODO,
    payload: id
});

export const removeTodo = (id: number) => ({
    type: REMOVE_TODO,
    payload: id
});

// Action type
type TodosAction = 
    | ReturnType<typeof addTodo>
    | ReturnType<typeof toggleTodo>
    | ReturnType<typeof removeTodo>;

// Declare state type
export type Todo = {
    id: number;
    text: string;
    done: boolean;
};

type TodosState = Todo[];

const initialState: TodosState = [
    { id: 1, text: 'Learn typescript', done: true },
    { id: 2, text: 'Use typescript with redux', done: true },
    { id: 3, text: 'Making Todo List', done: false }
];

function todos(state: TodosState = initialState, action: TodosAction): TodosState {
    switch(action.type) {
        case ADD_TODO:
            const nextId = Math.max(...state.map(todo => todo.id)) +1;
            return state.concat({
               id: nextId,
               text: action.payload,
               done: false, 
            });
        case TOGGLE_TODO:
            return state.map(todo =>
                todo.id === action.payload ? {...todo, done: !todo.done} : todo
            );
        case REMOVE_TODO:
            return state.filter(todo => todo.id !== action.payload);
        default:
            return state;
    }
}

export default todos;