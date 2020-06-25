import types from 'modules/realTimeDice/actionTypes';
import Action from 'interfaces/action';
import { Result, RollingType } from 'interfaces/dice';

// stateの型定義
export interface RealTimeDiceState {
  diceCount: number;
  diceSize: number;
  judgementNumber: number;
  rollingType: RollingType;
  globalResult?: Result;
  localResult?: Result;
  diceLog: boolean;
}

// stateの初期化
const initialState: RealTimeDiceState = {
  diceCount: 1,
  diceSize: 100,
  judgementNumber: 0,
  rollingType: false,
  diceLog: false,
};

// Reducerの定義
const RealTimeDice = (
  state = initialState,
  action: Action
): RealTimeDiceState => {
  switch (action.type) {
    case types.SET_DICE_COUNT: {
      return {
        ...state,
        diceCount: action.payload,
      };
    }
    case types.SET_DICE_SIZE: {
      return {
        ...state,
        diceSize: action.payload,
      };
    }
    case types.SET_JUDGEMENT_NUMBER: {
      return {
        ...state,
        judgementNumber: action.payload,
      };
    }
    case types.SET_ROLLING_TYPE: {
      return {
        ...state,
        rollingType: action.payload,
      };
    }
    case types.SET_GLOBAL_RESULT: {
      return {
        ...state,
        globalResult: action.payload,
      };
    }
    case types.SET_LOCAL_RESULT: {
      return {
        ...state,
        localResult: action.payload,
      };
    }
    case types.TOGGLE_DICE_LOG: {
      return {
        ...state,
        diceLog: !state.diceLog,
      };
    }
    default:
      return state;
  }
};

export default RealTimeDice;
