import React, {Component} from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
const colors = require('material-ui/styles/colors');
import Snackbar from 'material-ui/Snackbar';
import Welcome from '../../components/welcome';
import SquadLobby from '../../components/squadLobby';
import ErrorPage from './errorPage';
import {updateUserToken, getUserToken, setErrorText, clearErrorText, updateComponentTitle} from '../../actions';

class App extends Component {

  componentWillMount() {
    this.props.getUserToken();
  }

  renderErrorAlert() {
    return (
      (this.props.errorText) ?
        <Snackbar
          bodyStyle={{
            backgroundColor: colors.red900,
            textAlign: 'center',
          }}
          contentStyle={{
            color: 'white',
            fontWeight: 'bold'
          }}
          open={this.props.errorText ? true : false}
          message={this.props.errorText}
          onRequestClose={this.props.clearErrorText}
        /> : null
    )
  }

  renderWelcome() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/"
            render={() =>
              <Welcome
                componentTitle={this.props.componentTitle}
                updateComponentTitle={this.props.updateComponentTitle}
                setErrorText={this.props.setErrorText}
                updateUserToken={this.props.updateUserToken}
                getUserToken={this.props.getUserToken}
                userToken={this.props.userToken}
              />
            }
          />
          <Route component={ErrorPage} />
        </Switch>
      </BrowserRouter>
    )
  }

  renderApp() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={SquadLobby} />
          <Route component={ErrorPage} />
        </Switch>
      </BrowserRouter>
    )
  }

  render() {

    // Material UI Dark Theme Overhaul
    darkBaseTheme.palette.primary1Color = colors.grey600;
    darkBaseTheme.palette.accent1Color = colors.grey100;
    darkBaseTheme.palette.accent2Color = colors.grey900;

    return (
      <span>
      <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)} >
        <span>
          {this.renderErrorAlert()}
          {this.props.userToken ? this.renderApp() : this.renderWelcome() }
        </span>
      </MuiThemeProvider>
      </span>

    )
  }
}

function mapStateToProps(state) {
  return {
    userToken: state.userToken,
    errorText: state.errorText,
    componentTitle: state.componentTitle
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    updateUserToken,
    getUserToken,
    setErrorText,
    clearErrorText,
    updateComponentTitle
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
