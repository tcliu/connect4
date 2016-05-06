'use strict';

global.$ = global.jQuery = require('jquery');
const Bootstrap = require('bootstrap');
const React = require('react');
const ReactDOM = require('react-dom');
const App = require('./components/app');

var appElement = document.getElementById('app');
ReactDOM.render(<App />, appElement);