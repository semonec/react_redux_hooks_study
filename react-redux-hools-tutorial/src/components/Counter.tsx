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