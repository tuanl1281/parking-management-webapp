import { createStore, combineReducers, applyMiddleware } from 'redux';

import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { notifyMiddleware } from 'app/store/middlewares';

import reducers from 'app/reducers';
import types from 'app/actions/types';

const appReducers = combineReducers(reducers);

const combinedReducer = (state, action) => appReducers(action.type === types.LOG_OUT ? undefined : state, action);

const store = createStore(combinedReducer, composeWithDevTools(applyMiddleware(thunk, notifyMiddleware)));

export default store;
