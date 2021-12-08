import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

import { composeWithDevTools } from 'redux-devtools-extension';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';

export const SET_CONTENTSLIST = 'contentsList/SET_CONTENTSLIST';
export const SET_FILTER = 'searchFilter/SET_FILTER';
export const CANCEL_SET_FILTER = 'searchFilter/CANCEL_SET_FILTER';

const initState = [];
var contentsList;
var ids, entities;

function contentsListReducer(state = initState, action) {
  
  const { type, payload } = action;
  
  switch (type) {
    case SET_CONTENTSLIST : {
      contentsList = payload;
      return { ...state, contentsList }
    }
    default:
      return state;
  }
}

function searchFilterReducer(state = initState, action) {
  const { type, payload } = action;
  
  switch (type) {
    case SET_FILTER : {
      const { filterName, value } = payload;
      return {
        ...state,
        [filterName]: value,
      }
    }

    case CANCEL_SET_FILTER : {
      const { filterName, value } = payload;
      return {
        ...state,
        [filterName]: value,
      }
    }

    default:
      return state;
  }
}

let store = createStore(combineReducers({contentsListReducer, searchFilterReducer},composeWithDevTools()));

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
