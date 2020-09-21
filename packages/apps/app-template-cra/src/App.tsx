import './App.css';

import React from 'react';
import { sum } from 'lib-template-tsdx';

import logo from './logo.svg';

function App(): JSX.Element {
    const result = sum(1, 3);
    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                    Edit <code>src/App.tsx</code> and save to reload.
                </p>
                <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
                    Learn React
                </a>
                Sum: {result}
            </header>
        </div>
    );
}

export default App;
