import React, { Component } from 'react';
import '../styles/App.css';
import Calendar from './Calendar'
import MonthCell from './MonthCell'

class App extends Component {
  render() {
    return (
        <Calendar month={new Date()} cell={MonthCell} />
    );
  }
}

export default App;
