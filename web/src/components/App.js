import React, { Component } from 'react';
import logo from '../assets/logo.svg';
import '../styles/App.css';

class App extends Component {
  render() {
    return (
        <Calendar month={new Date()}>
            
        </Calendar>
    );
  }
}

export default App;
