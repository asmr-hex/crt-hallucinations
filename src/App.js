import React, { Component } from 'react';
import './App.css';
import p5 from 'p5'
import {hallucination} from './hallucination'


class App extends Component {
  componentDidMount() {
    this.canvas = new p5(hallucination, this.refs.wrapper)
  }

  componentWillReceiveProps(props, newprops) {
    if (this.canvas.redrawWithProps) {
      this.canvas.redrawWithProps(newprops)
    }
  }

  render() {
    return <div className='context' ref='wrapper'></div>
  }
}

export default App;
