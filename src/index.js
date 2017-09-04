import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Calendar from './Calendar';
import { createStore } from 'redux'
import {Provider} from 'react-redux'





var data = {
  "mo": [
    {
      "bt": 240,
      "et": 779
    }
  ],
  "tu": [],
  "we": [],
  "th": [
    {
      "bt": 240,
      "et": 779
    },
    {
      "bt": 1140,
      "et": 1319
    }
  ],
  "fr": [
    {
      "bt": 660,
      "et": 1019
    }
  ],
  "sa": [
    {
      "bt": 0,
      "et": 1439
    }
  ],
  "su": []
};

var storage = localStorage.getItem('storage');
let parsed;


if (!storage) {
  localStorage.setItem('storage', JSON.stringify(data));
  parsed = data;
} else {
  parsed = JSON.parse(storage);
}


const initialState = storage 
  ? JSON.parse(storage)
  : data;

let store = createStore(reducer);

store.subscribe( () => {
  console.log('subscribe' , store.getState())
})


function reducer(state = initialState, action) {


  if (action.type === 'data') {
    return action.payload;
  } else {
    return state;
  }
}


ReactDOM.render(
  <Provider store={store}>
    <Calendar data={parsed}/>
  </Provider>, 
  document.getElementById('root')
);


