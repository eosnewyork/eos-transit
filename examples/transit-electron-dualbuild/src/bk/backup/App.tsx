import React, { Component } from 'react';
import classes from './App.module.css';

import Logo from '../Logo/Logo';
import TestFs from '../model/TestFs';

class App extends Component {

    render() {
        return (
          <div className={classes.App}>
            <header className={classes.AppHeader}>
              <Logo />
              <textarea className={classes.TextArea} value={TestFs.getDirectoryListing()} readOnly rows={20} />
            </header>
          </div>
        );
    }
}

export default App;
