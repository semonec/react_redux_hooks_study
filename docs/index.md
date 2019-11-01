---
layout: post
title:  "Welcome to Jekyll!"
date:   2019-07-26 11:49:00 +0900
categories: Post
comments: true
---
# react_redux_hooks_study with typescript

[Refs](https://velog.io/@velopert/use-typescript-and-redux-like-a-pro)

## Create sample application, and initial setup.

Create demo application with CRA

> $ yarn create react-app react-redux-hooks-tutorial --typescript

Install redux, react-redux

> $ yarn add redux react-redux@next redux-devtools-extension

> $ yarn add @types/react-redux @types/redux-devtools-extension

Create below directories under `src`

- components/
- containers/
- modules/

## Create Counter redux module

<b>src/modules/counter.ts</b>

<b>1. Declare action types.</b>
When you declare type, you should have to attach `as const` keyword.

~~~javascript
const INCREASE = 'counter/INCREASE' as const;
const DECREASE = 'counter/DECREASE' as const;
const INCREASE_BY = 'counter/INCREASE_BY' as const;
~~~

`as const` is a TypeScript grammer, called as [const assertions](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#const-assertions).
When we create action object using action creator, type's type isn't a `string`, actual value itself.

<b>2. Create action creation function</b>

when create action creators, use can use `function` keyword or arrow function.
With arrow, we could omit return phrase.

~~~javascript
export const increase = () => ({ type: INCREASE });
export const decrease = () => ({ type: DECREASE });
export const increaseBy = (diff: number) => ({
  type: INCREASE_BY,
  payload: diff
});
~~~

`increase` `decrease` wouldn't receive any parameter from function.
In case of `increaseBy`, get `diff` value as parameter, and set action's `payload`.
name of `payload` follows [FSA rule](https://github.com/redux-utilities/flux-standard-action)

all the action creators with `export`, so we can use it containers.

<b>3. Preparation type for the action objects </b>

We should have to prepare actions, which we've made, for set action parameter's type while writing reducer.

~~~javascript
type CounterAction =
  | ReturnType<typeof increase>
  | ReturnType<typeof decrease>
  | ReturnType<typeof increaseBy>;
~~~

`ReturnType` is a util type, that helps us getting type which is returned from function.

The usage of `as const` keyword, makes `ReturnType` make the type with specific values, not a common `string` itself.

<b>4. Declare state's type, initial state</b>

Declare state's type and state's intial value.

~~~javascript
type CounterState = {
  count: number;
}

const initialState: CounterState = {
  count: 0
};
~~~

You can use `type` or `interface` when declaring state's type.

<b> 5. Create reducer</b>

~~~javascript
function counter(state: CounterState = initialState, action: CounterAction) {
    switch(action.type) {
        case INCREASE:
            return { count: state.count + 1};
        case DECREASE:
            return { count: state.count -1 };
        case INCREASE_BY:
            return { count: state.count + action.payload };
        default:
            return state;
    }
}
~~~

### Apply Redux to the project ###

Now, We'll apply redux to our project.
We have only one reducer, counter, but we'll create more reducer in the future.
So, now we'll create root reducer.

<b>modules/index.ts</b>

~~~javascript
import { combineReducers } from 'redux';
import counter from './counter';

const rootReducer = combineReducers({
  counter
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;
~~~

Similar with javascript code, but you should have to create `RootState` type, and export it.
This type is needed when we use `useSelector` for accessing state which are stored in the store, while creating container component.



Now, create store, and apply redux into react project with Provider component.

<b>index.tsx</b>

~~~javascript
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import rootReducer from './modules';

const store = createStore(rootReducer);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
~~~

### Create Counter presentational component ###

Follows [Presentational and Container Components](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)
but it's not mandatory.

<b>src/components/Counter.tsx</b>

~~~javascript
import React from 'react';

type CounterProps = {
  count: number;
  onIncrease: () => void;
  onDecrease: () => void;
  onIncreaseBy: (diff: number) => void;
};

function Counter({
  count,
  onIncrease,
  onDecrease,
  onIncreaseBy
}: CounterProps) {
  return (
    <div>
      <h1>{count}</h1>
      <button onClick={onIncrease}>+1</button>
      <button onClick={onDecrease}>-1</button>
      <button onClick={() => onIncreaseBy(5)}>+5</button>
    </div>
  );
}

export default Counter;
~~~

All the values and function which are needed in components are handled with props. 

### Create Counter Container component ###

<b>containers/CounterContainer.tsx</b>

~~~javascript
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Counter from '../components/Counter';
import { RootState } from '../modules/index';
import { increase, decrease, increaseBy } from '../modules/counter';

function CounterContainer() {
    const count = useSelector((state: RootState) => state.counter.count);
    const dispatch = useDispatch();

    const onIncrease= () => {
        dispatch(increase());
    };

    const onDecrease= () => {
        dispatch(decrease());
    };

    const onIncreaseBy= (diff: number) => {
        dispatch(increaseBy(diff));
    };

    return (
        <Counter
            count={count}
            onIncrease={onIncrease}
            onDecrease={onDecrease}
            onIncreaseBy={onIncreaseBy}
        />
    );
}

export default CounterContainer;
~~~

Check in `useSelector` phrase, `state` type as `RootState`

Now, render this CounterContainer at App component.

<b>App.tsx</b>

~~~javascript
import React from 'react';
import CounterContainer from './containers/CounterContainer';

const App: React.FC = () => {
  return <CounterContainer />;
}

export default App;
~~~

### If we do not seperate Presentational/ Container ? ###

> <i>"Hooks let me do the same thing without an arbitrary division," [original](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0#99d5)</i>

When you use a component, do not use props, create a custom Hook with `useSelector` and `useDispatch`, use it.

We'll create `useCounter` custom Hook.

<b>hooks/useCounter.tsx</b>

~~~javascript
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../modules/index';
import { increase, decrease, increaseBy } from '../modules/counter';
import { useCallback } from 'react';

export default function useCounter() {
    const count = useSelector((state: RootState) => state.counter.count);
    const dispatch = useDispatch();

    const onIncrease = useCallback(() => dispatch(increase()), [dispatch]);
    const onDecrease = useCallback(() => dispatch(decrease()), [dispatch]);
    const onIncreaseBy = useCallback(
        (diff: number) => dispatch(increaseBy(diff)), [dispatch]);

    return {
        count,
        onIncrease,
        onDecrease,
        onIncreaseBy
    };
}
~~~

Like composing Container, but not a component, as Hook.
Now, you can this `useCounter` hook at Presentational Component.
Ah, from now on, there's no need to distingish presentational and container.

Fix Counter.tsx and index.tsx

<b>components/Counter.tsx</b>

~~~javascript
import React from 'react';
import useCounter from '../hooks/useCounter';

type CounterProps = {
    count: number;
    onIncrease: () => void;
    onDecrease: () => void;
    onIncreaseBy: (diff: number) => void;
}


const Counter: React.FC = () => {
    const { count, onIncrease, onDecrease, onIncreaseBy} = useCounter();

    return (
        <div>
            <h1>{count}</h1>
            <button onClick={onIncrease}>+1</button>
            <button onClick={onDecrease}>-1</button>
            <button onClick={() => onIncreaseBy(5)}>+5</button>

        </div>
    );
}

export default Counter;
~~~

All that needed are from `useCounter` Hook, not from props.
Now, we don't need containers, so remove `containers` directory.

All will render Counter.

<b>App.tsx</b>

~~~javascript
import React from 'react';
import Counter from './components/Counter';

const App: React.FC = () => {
  return <Counter />;
}

export default App;
~~~

Before Hooks, when we composing Container component, comminucate between component and redux through `connect()` as [HOC pattern](https://reactjs.org/docs/higher-order-components.html)

# Creating ToDo List redux module #

Now, more complecated redux module, ToDo List.
In this time, payload, which required while crateing action object, value will be different for each action.

create todos.ts file in modules directory.

<b>modules/todos.ts</b>

### action type / action creation function/ action type declare ###

~~~javascript
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
~~~

### declare state type, and initial state ###

~~~javascript
// Declare state type
export type Todo = {
    id: number;
    text: string;
    done: boolean;
};

type TodoState = Todo[];

const initialState: TodosState = [
    { id: 1, text: 'Learn typescript', done: true },
    { id: 2, text: 'Use typescript with redux', done: true },
    { id: 3, text: 'Making Todo List', done: false }
];
~~~

type `Todo` was exported because it would be used at component later.
Now, create reducer

~~~javascript
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
~~~

### register to root reducer ###

~~~javascript
import { combineReducers } from 'redux';
import counter from './counter';
import todos from './todos';

const rootReducer = combineReducers({
    counter,
    todos
});

export default rootReducer; // ducks pattern

export type RootState = ReturnType<typeof rootReducer>;
~~~

## Prepare ToDo List component ##

We'll create 3 components

- TodoInsert: Add new item
- TodoItem: Show Todo item
- TodoList: Show multiple TodoItem component

<b>components/TodoInsert.tsx</b>

TodoInsert component is a component for add a new item.
Status of Input will be managed by local state with useState.
We can use `useDispatch` within this component, but we'll use custom Hook.

~~~javascript
import React, { ChangeEvent, FormEvent, useState }from 'react';

const TodoInsert: React.FC = () => {
    const [value, setValue] = useState('');
    const onChange= (e: ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    };

    const onSubmit = (e:FormEvent) => {
        e.preventDefault();
        // TODO: Add new item using custom Hook 
        setValue('');
    };
    return (
        <form onSubmit={onSubmit}>
            <input
                placeholder="Input todo item."
                value={value}
                onChange={onChange}
            />
            <button type="submit">Add</button>
        </form>
    );
} 

export default TodoInsert;
~~~

> // TODO will be implemented later with custom Hook. 

<b>components/TodoItem.tsx</b>

TodoItem component will show the information of what to do.
When click text, `done` value will be changed.
When click (x) right side, it will be deleted.

Get `todo` from props. and toggling and removal function `onToggle`, `onRemove` will be implemented later 
(ofc, `onToggle` and `onRemove` could be put into props)

~~~javascript
import React from 'react';
import './TodoItem.css';
import { Todo } from '../modules/todos';

type TodoItemProps = {
    todo: Todo;
};

function TodoItem({ todo }: TodoItemProps) {
    // TODO: Implement onToggle/ onRemove with Custom Hook
    return (
        <li className={`TodoItem ${todo.done ? 'done': ''}`}>
            <span className='text'>{todo.text}</span>
            <span className='remove'>(X)</span>
        </li>
    );
}

export default TodoItem;
~~~

<b>components/TodoItem.css</b>

Create a css for TodoItem component

~~~javascript
.TodoItem .text {
  cursor: pointer;
}

.TodoItem.done .text {
  color: #999999;
  text-decoration: line-through;
}

.TodoItem .remove {
  color: red;
  margin-left: 4px;
  cursor: pointer;
}
~~~

<b>components/TodoList.tsx</b>

TodoList Component.
It will look up `todos` array which stored by redux store with custom Hook.

~~~javascript
import React from 'react';
import { Todo } from '../modules/todos';
import TodoItem from './TodoItem';

const TodoList: React.FC = () => {
    const todos: Todo[] = []; // Look up with custom Hook

    if (!todos.length) {
        return <p>No items</p>;
    }

    return (
        <ul>
            {todos.map(todo => (
                <TodoItem todo={todo} key={todo.id} />   
            ))}
        </ul>
    );
}

export default TodoList;
~~~

### Render above Components from App ###

<b>App.tsx</b>

~~~javascript
import React from 'react';
import Counter from './components/Counter';
import TodoInsert from './components/TodoInsert';
import TodoList from './components/TodoList';

const App: React.FC = () => {
  return (
    <>
      <TodoInsert />
      <TodoList />
    </>
  );
}

export default App;
~~~

## Implement custom Hook ##

### useTodos hook ###

useTodos Hook will look up todo items.

<b>hooks/useTodos.ts</b>

~~~javascript
import { useSelector } from 'react-redux';
import { RootState } from '../modules/index';
import { Todo } from '../modules/todos';

 const useTodos: () => Todo[] = () => {
    const todos = useSelector((state: RootState) => state.todos);
    return todos;
}

export default useTodos;
~~~

<b>components/TodoList.tsx</b>

```javascript
import React from 'react';
import { Todo } from '../modules/todos';
import TodoItem from './TodoItem';
import useTodos from '../hooks/useTodos';

const TodoList: React.FC = () => {
    const todos: Todo[] = useTodos();

    if (!todos.length) {
        return <p>No items</p>;
    }

    return (
        <ul>
            {todos.map(todo => (
                <TodoItem todo={todo} key={todo.id} />   
            ))}
        </ul>
    );
}

export default TodoList;
```

### useAddTodo Hook ###

`useAddTodo` will register todo item

<b>hooks/useAddTodo.ts</b>

~~~javascript
import { useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { addTodo } from '../modules/todos';

const useAddTodo: () => Function = () => {
    const dispatch = useDispatch();
    return useCallback(text => dispatch(addTodo(text)), [dispatch]);
}

export default useAddTodo;
~~~

<b>components/TodoInsert.tsx</b>

~~~javascript
import React, { ChangeEvent, FormEvent, useState }from 'react';
import useAddTodo from '../hooks/useAddTodo';

const TodoInsert: React.FC = () => {
    const [value, setValue] = useState('');
    const addTodo = useAddTodo();

    const onChange= (e: ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    };

    const onSubmit = (e:FormEvent) => {
        e.preventDefault();
        addTodo(value);
        setValue('');
    };
    return (
        <form onSubmit={onSubmit}>
            <input
                placeholder="Input todo item."
                value={value}
                onChange={onChange}
            />
            <button type="submit">Add</button>
        </form>
    );
} 

export default TodoInsert;
~~~

### useTodoActions Hook ###

`useTodoActions` Hook toggle/remove todo item.

<b>hooks/useTodoActions.ts</b>

~~~javascript
import { useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { toggleTodo, removeTodo } from '../modules/todos';

const useTodoActions: (id: number) => any = (id: number) => {
    const dispatch = useDispatch();
    const onToggle = useCallback(() => dispatch(toggleTodo(id)), [dispatch, id]);
    const onRemove = useCallback(() => dispatch(removeTodo(id)), [dispatch, id]);

    return { onToggle, onRemove };
}

export default useTodoActions
~~~

<b>components/TodoItem.tsx</b>

~~~javascript
import React from 'react';
import './TodoItem.css';
import { Todo } from '../modules/todos';
import useTodoActions from '../hooks/useTodoActions';

type TodoItemProps = {
    todo: Todo;
};

function TodoItem({ todo }: TodoItemProps) {
    const { onToggle, onRemove } = useTodoActions(todo.id); 

    return (
        <li className={`TodoItem ${todo.done ? 'done': ''}`}>
            <span className='text' onClick={onToggle}>{todo.text}</span>
            <span className='remove' onClick={onRemove} >(X)</span>
        </li>
    );
}

export default TodoItem;
~~~

### ducks pattern

[Ducks mudular](https://github.com/JisuPark/ducks-modular-redux)

1. <b>Always</b> `reducer()` function should `export default` 
2. <b>Always</b> module's action creator `export` as function
3. <b>Always</b> bring action type formed as `npm-module-orr-app/reducer/ACTION_TYPE` 
4. <b>Maybe</b> action types `export` as `UPPER_SNAKE_CASE`
