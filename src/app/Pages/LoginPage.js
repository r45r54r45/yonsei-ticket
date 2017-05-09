import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {Card, CardActions} from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';
import RaisedButton from 'material-ui/RaisedButton';
import Snackbar from 'material-ui/Snackbar';
import TextField from 'material-ui/TextField';
import {cyan500, pinkA200} from 'material-ui/styles/colors';
import yonsei_logo from './yonsei_logo.png'
import {postWithAuth, post}  from '../utils/request';
import LinearProgress from 'material-ui/LinearProgress';

const styles = {
  main: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    minWidth: 300,
  },
  avatar: {
    margin: '1em',
    textAlign: 'center ',
  },
  form: {
    padding: '0 1em 1em 1em',
  },
  input: {
    display: 'flex',
  },
  hint: {
    textAlign: 'center',
    marginTop: '1em',
    color: '#ccc',
  },
  signInProgress: {
    fontSize: '10px',
    textAlign: 'center'
  }
};

function getColorsFromTheme(theme) {
  if (!theme) return {primary1Color: cyan500, accent1Color: pinkA200};
  const {
    palette: {
      primary1Color,
      accent1Color,
    },
  } = theme;
  return {primary1Color, accent1Color};
}
class LoginPage extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      signInError: null,
      LOGIN_PASSWORD: null,
      SCHOOL_ID: null,
      signInProgress: false
    }
    this.login = this.login.bind(this);
  }

  login() {
    const {LOGIN_PASSWORD, SCHOOL_ID} = this.state;
    this.setState({
      signInError: null,
      signInProgress: true
    })
    post('/login', {
      SCHOOL_ID,
      LOGIN_PASSWORD
    }).then(result => {
      if (result.code === -1) {
        console.log(result.err_msg);
        this.setState({
          signInError: 'Wrong ID or PASSWORD',
          signInProgress: false
        })
        setTimeout(() => {
          this.setState({
            signInError: null
          })
        }, 1500)
      } else {
        return firebase.auth().signInWithCustomToken(result.token)
      }
    })
      .catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(error)
        if (error) {
          alert(errorMessage);
        }
      });
  }

  render() {
    const {handleSubmit, submitting, theme} = this.props;
    const {signInError, signInProgress} = this.state;
    const muiTheme = getMuiTheme(theme);
    const {primary1Color} = getColorsFromTheme(muiTheme);
    return (
      <div style={{...styles.main, backgroundColor: primary1Color}}>
        <Card style={styles.card}>
          <div style={styles.avatar}>
            <Avatar src={yonsei_logo} size={60}/>
          </div>
          {signInProgress && (
            <div style={styles.signInProgress}>
              <span>Initial login will take several seconds..</span>
              <LinearProgress mode="indeterminate"/>
            </div>)}
          {signInError && <Snackbar open autoHideDuration={1500} message={signInError.message || signInError}/>}
          <div style={styles.form}>
            <div style={styles.input}>
              <TextField
                onChange={e => this.setState({
                  SCHOOL_ID: e.target.value
                })}
                floatingLabelText={'Student Number'}
                name="username"
                fullWidth
              />
            </div>
            <div style={styles.input}>
              <TextField
                onChange={e => this.setState({
                  LOGIN_PASSWORD: e.target.value
                })}
                floatingLabelText={'Portal Password'}
                name="password"
                type="password"
                fullWidth
              />
            </div>
          </div>
          <CardActions>
            <RaisedButton type="button" primary onTouchTap={this.login} label={'Sign In / Sign Up'} fullWidth
                          style={{margin: '10px 0'}}/>
          </CardActions>
        </Card>
      </div>
    );
  }
}

export default LoginPage;
