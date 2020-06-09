import { combineReducers } from 'redux';
import realTimeDice, { RealTimeDiceState } from './realTimeDice/reducers';

// 全Stateを結合
export interface State {
  realTimeDice: RealTimeDiceState;
}

// 全Reducerを結合
export default combineReducers({
  realTimeDice,
});
