import types from 'modules/realTimeDice/actionTypes';
import Action from 'interfaces/action';

const toggleLog = (): Action => ({
  type: types.TOGGLE_LOG,
});

export default toggleLog; // Actionが2つになったらデフォルトエクスポートやめます
