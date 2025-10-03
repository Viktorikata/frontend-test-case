import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux';
import { store } from './store/store' /*Перенесла с App.jsx */
import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/*Перенесла Provider сюда*/}
    <Provider store={store}>
    <App />
    </Provider>
  </React.StrictMode>,
)
