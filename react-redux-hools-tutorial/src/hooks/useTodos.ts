import { useSelector } from 'react-redux';
import { RootState } from '../modules/index';
import { Todo } from '../modules/todos';

 const useTodos: () => Todo[] = () => {
    const todos = useSelector((state: RootState) => state.todos);
    return todos;
}

export default useTodos;