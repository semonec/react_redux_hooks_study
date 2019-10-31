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