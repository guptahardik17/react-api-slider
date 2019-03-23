import React, { Component } from 'react';
import './App.css';

import Slider from './components/Slider';

class App extends Component {
  render() {
    return (
      <div className="App">

        <Slider sliderWidth="400" sliderHeight="250"/>

      </div>
    );
  }
}

export default App;
