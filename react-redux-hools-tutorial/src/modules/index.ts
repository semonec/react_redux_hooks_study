import { combineReducers } from 'redux';
import counter from './counter';

const rootReducer = combineReducers({
    counter
});

export default rootReducer; // ducks pattern

export type RootState = ReturnType<typeof rootReducer>;