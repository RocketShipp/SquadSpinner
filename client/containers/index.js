import React, { Component } from 'react';
import io from 'socket.io-client';
import '../stylesheets/index.scss';

class App extends Component {
  render() {
    return (
      <a href="/api/auth/facebook">Facebook</a>
    )
  }
};

export default App;
