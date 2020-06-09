import { Action } from './actions';
import types from './actionTypes';

// stateの型定義
export interface RealTimeDiceState {
  log: {
    isShow: boolean;
  };
}

// stateの初期化
const initialState: RealTimeDiceState = {
  log: {
    isShow: false,
  },
};

// Reducerの定義
const RealTimeDice = (
  state = initialState,
  action: Action
): RealTimeDiceState => {
  switch (action.type) {
    case types.TOGGLE_LOG: {
      if (state.log.isShow) {
        return {
          ...state,
          log: {
            isShow: false,
          },
        };
      }

      return {
        ...state,
        log: {
          isShow: true,
        },
      };
    }

    default:
      return state;
  }
};

export default RealTimeDice;
