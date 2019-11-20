import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import 'bootstrap/dist/css/bootstrap.css'
import Auth from './auth0/Auth'

const auth = new Auth();

let state = {};
window.setState = (changes) =>{
  state = Object.assign({}, state, changes);

  ReactDOM.render(
    <App {...state}/>,
    document.getElementById('root')
  );
  
}

/*eslint no-restricted-globals:0*/
let username = auth.getProfile().given_name || "";
let image = auth.getProfile().picture || "";

let initialState={
  name: username,
  user_image: image,
  location: location.pathname.replace(/^\/?|\/$/g,""),
  auth,
}

window.setState(initialState);
