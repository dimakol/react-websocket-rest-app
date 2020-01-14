import React from 'react';
import './App.css';
import {Link, Switch, Route} from 'react-router-dom';
//import Websockets from '../../pages/WebSockets/Websockets'; // WebSockets implementation using React class components
import WebsocketsWithHooks from '../../pages/WebSockets/WebsocketsWithHooks';
import RestApi from '../../pages/RestApi/RestApi';

/**
 * The main app component
 * Here the routes of the application declared
 */
const App = () => {
  return (
    <div className="App">
      <Link to='/websocket'>WebSocket</Link>
      <Link to='/restapi'>RestAPI</Link>
      <Switch>
        <Route exact path='/websocket' component={WebsocketsWithHooks}/>
        <Route exact path='/restapi' component={RestApi}/>
      </Switch>
    </div>
  );
}

export default App;
