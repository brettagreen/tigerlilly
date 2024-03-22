import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import reportWebVitals from './reportWebVitals';

/**
 * @module /frontend/src/index
 * @requires module:react
 * @requires module:react-dom/client
 * @requires module:/frontend/src/components/App
 * @requires module:/frontend/src/reportWebVitals
 * @author Brett A. Green <brettalangreen@proton.me>
 * @version 1.0
 * 
 * @description ties App component to public/index.html 'root' element/div
 */
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <>
        <App />
    </>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
