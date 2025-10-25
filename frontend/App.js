import React from 'react';
import './App.css';
import Menu from './pages/Menu';


function App() {
    return (
        <div className='App'>
            {/* routing here to switch */}
            <Menu />{/* Render the Menu component */}
            {/*<Login/> */}
        </div>
    );
}

export default App;