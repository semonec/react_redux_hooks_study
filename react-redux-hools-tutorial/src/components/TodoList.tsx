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