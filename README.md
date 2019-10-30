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

~~~
const INCREASE = 'counter/INCREASE' as const;
const DECREASE = 'counter/DECREASE' as const;
const INCREASE_BY = 'counter/INCREASE_BY' as const;
~~~

`as const` is a TypeScript grammer, called as [const assertions](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#const-assertions).
When we create action object using action creator, type's type isn't a `string`, actual value itself.

<b>2. Create action creation function</b>

when create action creators, use can use `function` keyword or arrow function.
With arrow, we could omit return phrase.

~~~
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

~~~
type CounterAction =
  | ReturnType<typeof increase>
  | ReturnType<typeof decrease>
  | ReturnType<typeof increaseBy>;
~~~

`ReturnType` is a util type, that helps us getting type which is returned from function.

The usage of `as const` keyword, makes `ReturnType` make the type with specific values, not a common `string` itself.

<b>4. Declare state's type, initial state</b>

Declare state's type and state's intial value.

~~~
type CounterState = {
  count: number;
}

const initialState: CounterState = {
  count: 0
};
~~~

You can use `type` or `interface` when declaring state's type.

<b> 5. Create reducer</b>

~~~
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

~~~
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

~~~
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

~~~
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

~~~
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

~~~
import React from 'react';
import CounterContainer from './containers/CounterContainer';

const App: React.FC = () => {
  return <CounterContainer />;
}

export default App;
~~~

### If we do not seperate Presentational/ Container ? ###

> <i>"Hooks let me do the same thing without an arbitrary division," [original](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0#99d5)

When you use a component, do not use props, create a custom Hook with `useSelector` and `useDispatch`, use it.

We'll create `useCounter` custom Hook.

<b>hooks/useCounter.tsx

~~~
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

~~~
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

~~~
import React from 'react';
import Counter from './components/Counter';

const App: React.FC = () => {
  return <Counter />;
}

export default App;
~~~

Before Hooks, when we composing Container component, comminucate between component and redux through `connect()` as [HOC pattern](https://reactjs.org/docs/higher-order-components.html)



### ducks pattern

[Ducks mudular](https://github.com/JisuPark/ducks-modular-redux)

1. <b>Always</b> `reducer()` function should `export default` 
2. <b>Always</b> module's action creator `export` as function
3. <b>Always</b> bring action type formed as `npm-module-orr-app/reducer/ACTION_TYPE` 
4. <b>Maybe</b> action types `export` as `UPPER_SNAKE_CASE`
