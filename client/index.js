import './reset.css';
import React from 'react';
import ReactDOM from 'react-dom';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import App from './containers/topLevel';
import allReducers from './reducers';

ReactDOM.render(
  <Provider store={createStore(allReducers)}>
    <App />
  </Provider>
  , document.getElementById('root'));
