import { combineReducers } from 'redux';
import realTimeDice, { RealTimeDiceState } from 'modules/realTimeDice/reducers';
import partyViewer, { PartyViewerState } from 'modules/partyViewer/reducers';
import characterMaker, {
  CharacterMakerState,
} from 'modules/characterMaker/reducers';

// 全Stateを結合
export interface State {
  realTimeDice: RealTimeDiceState;
  partyViewer: PartyViewerState;
  characterMaker: CharacterMakerState;
}

// 全Reducerを結合
export default combineReducers({
  realTimeDice,
  partyViewer,
  characterMaker,
});
