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