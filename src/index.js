import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

import { composeWithDevTools } from 'redux-devtools-extension';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';

export const SET_CONTENTSLIST = 'contentsListReducer/SET_CONTENTSLIST';
export const SET_FILTER = 'searchFilterReducer/SET_FILTER';
export const CANCEL_SET_FILTER = 'searchFilterReducer/CANCEL_SET_FILTER';
export const RESET_FILTER = 'searchFilterReducer/RESET_FILTER';

const initContentsList = {
  ids: [],
  entities: {},
};
const initSearchFilter = {};

function contentsListReducer(state = initContentsList, action) {
  
  const { type, payload } = action;
  
  switch (type) {
    case SET_CONTENTSLIST : {
      const ids = payload.map((entity) => entity['id']);

      const entities = payload.reduce((finalEntities, entity) => ({
        ...finalEntities,
        [entity['id']]: entity,
      }), {});
      return { ...state, ids, entities };
    }

    default:
      return state;
  }
}

function searchFilterReducer(state = initSearchFilter, action) {
  const { type, payload } = action;

  switch (type) {
    case SET_FILTER : {
      const { filterName, value } = payload;
      return {
        ...state, 
        [filterName]: value,
      }
    }
    case RESET_FILTER: {
      return initSearchFilter;
    }
    default:
      return state;
  }
}

var store = createStore(combineReducers({contentsListReducer, searchFilterReducer},composeWithDevTools()));

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
