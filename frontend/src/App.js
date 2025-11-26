import React from 'react';
import Nav from './components/Nav/Nav';
import Books from './components/Books/Books';
import Students from './components/Students/Students';
import Issue from './components/Issue/Issue';
import Return from './components/Return/Return';
import Search from './components/search/search';
import Dashboard from './components/Dashboard/Dashboard';
import FineManagement from './components/FineManagement/FineManagement';
import './App.css';
import {Route, Redirect, Switch} from 'react-router-dom';

class App extends React.Component {

  render(){
    return (
      <div className="App">
        <Nav />
        <Switch>
          <Route path='/' exact strict component={Dashboard}/>
          <Route path='/books' exact strict component={Books}/>
          <Route path='/students' exact strict component={Students}/>
          <Route path='/issue' exact strict component={Issue}/>
          <Route path='/return' exact strict component={Return}/>
          <Route path='/search' exact strict component={Search}/>
          <Route path='/fines' exact strict component={FineManagement}/>
          <Redirect from='*' to='/'/>
        </Switch>
      </div>
    );
  }
}

export default App;
