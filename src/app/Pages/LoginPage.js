import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { Card, CardActions } from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';
import RaisedButton from 'material-ui/RaisedButton';
import Snackbar from 'material-ui/Snackbar';
import TextField from 'material-ui/TextField';
import { cyan500, pinkA200 } from 'material-ui/styles/colors';
// import yonsei_logo from './yonsei_logo.png'
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
};

function getColorsFromTheme(theme) {
  if (!theme) return { primary1Color: cyan500, accent1Color: pinkA200 };
  const {
    palette: {
      primary1Color,
      accent1Color,
    },
  } = theme;
  return { primary1Color, accent1Color };
}
class LoginPage extends Component {
  constructor(props, context) {
    super(props, context);
    this.state={
      signInError: ''
    }
  }
  render() {
    const { handleSubmit, submitting, theme } = this.props;
    const { signInError } = this.state;
    const muiTheme = getMuiTheme(theme);
    const { primary1Color} = getColorsFromTheme(muiTheme);
    return (
      <div style={{ ...styles.main, backgroundColor: primary1Color }}>
        <Card style={styles.card}>
          <div style={styles.avatar}>
            <Avatar src={yonsei_logo} size={60} />
          </div>
          {signInError && <Snackbar open autoHideDuration={4000} message={signInError.message || signInError}/>}
            <div style={styles.form}>
              <div style={styles.input} >
                <TextField
                  floatingLabelText={'Student Number'}
                  name="username"
                  fullWidth
                />
              </div>
              <div style={styles.input}>
                <TextField
                  floatingLabelText={'Portal Password'}
                  name="password"
                  type="password"
                  fullWidth
                />
              </div>
            </div>
            <CardActions>
              <RaisedButton type="button" primary onTouchTap={e=>console.log(e)} label={'Sign In / Sign Up'} fullWidth style={{margin: '10px 0'}}/>
            </CardActions>
        </Card>
      </div>
    );
  }
}

export default LoginPage;
