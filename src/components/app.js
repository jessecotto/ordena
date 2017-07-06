import { h, Component } from 'preact';
import { Router } from 'preact-router';

import TwilioClient from '../lib/sync-client';

import Header from './header';
import Home from '../routes/home';
import Orders from '../routes/orders';
import Admin from '../routes/admin';
// import Home from 'async!./home';
// import Profile from 'async!./profile';

export default class App extends Component {
  constructor(...args) {
    super(...args);
    this.state.isLoggedIn = false;
    this.state.isAdmin = false;
    this.syncClient = TwilioClient.shared();
  }

  componentWillMount() {
    this.syncClient.on('disconnected', () => {
      this.setState({ isAdmin: false, isLoggedIn: false });
    });
    this.syncClient
      .init()
      .then(() => {
        const isAdmin = this.syncClient.role === 'admin';
        const isLoggedIn = true;
        this.setState({ isAdmin, isLoggedIn });
      })
      .catch(err => {
        const isAdmin = false;
        const isLoggedIn = false;
        this.setState({ isAdmin, isLoggedIn });
      });
  }

  /** Gets fired when the route changes.
	 *	@param {Object} event		"change" event from [preact-router](http://git.io/preact-router)
	 *	@param {string} event.url	The newly routed URL
	 */
  handleRoute = e => {
    this.currentUrl = e.url;
  };

  render() {
    return (
      <div id="app">
        <Header
          isLoggedIn={this.state.isLoggedIn}
          isAdmin={this.state.isAdmin}
        />
        <Router onChange={this.handleRoute}>
          <Home path="/" />
          <Orders path="/orders" />
          <Admin isAdmin={this.state.isAdmin} path="/admin" />
        </Router>
      </div>
    );
  }
}
