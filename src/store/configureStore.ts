import { createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import reducer from 'modules';

const configureStore = createStore(reducer, composeWithDevTools());

export default configureStore;
