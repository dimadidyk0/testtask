import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Calendar from './Calendar';

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


ReactDOM.render(<Calendar data={parsed}/>, document.getElementById('root'));


