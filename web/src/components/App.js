import React, { Component } from 'react';
import '../styles/App.css';
import Calendar from './Calendar'
import MonthCell from './MonthCell'

class App extends Component {
  render() {
    return (
        <Calendar width="100%" height="100%" month={new Date()} cell={MonthCell} />
    );
  }
}

export default App;
