import React, {Component} from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect
} from 'react-router-dom'
import AppBar from 'material-ui/AppBar';
import Main from './Pages/Main.js';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import Drawer from 'material-ui/Drawer'
import CardPage from './Pages/CardPage';
import BusPage from './Pages/BusPage';
import {List, ListItem} from 'material-ui/List';
import CardImage from 'material-ui/svg-icons/action/credit-card';
import LogoutImage from 'material-ui/svg-icons/communication/call-missed-outgoing'
import BusImage from 'material-ui/svg-icons/maps/directions-bus';
import ListImage from 'material-ui/svg-icons/action/view-list';
import NoticeImage from 'material-ui/svg-icons/action/dashboard'
import PersonImage from 'material-ui/svg-icons/social/people';
import Subheader from 'material-ui/Subheader';
import LoginPage from './Pages/LoginPage';
import AdminUsersPage from './Admin/Users';
import AdminBusPage from './Admin/Bus'
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField'
import TicketPage from './Pages/TicketPage'
const style = {
  spacer: {
    height: '30px'
  },
  a: {
    textDecoration: 'none'
  }
}
class Login extends Component {
  static muiName = 'FlatButton';

  render() {
    return (
      <FlatButton {...this.props} label="Login"/>
    );
  }
}
const logined = true;

class Routing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuOpen: false,
      pageTitle: 'UIC',
      helpOpen: false
    }
    this.menuToggle = this.menuToggle.bind(this);
  }

  menuToggle(title) {
    if(title){
      this.setState({
        pageTitle: title,
        menuOpen: !this.state.menuOpen
      })
    }else{
      this.setState({
        menuOpen: !this.state.menuOpen
      })
    }
  }

  render() {
    return (
      <Router>
        <div>
          {logined
            ? (
              <div>
                <AppBar
                  title={this.state.pageTitle}
                  onLeftIconButtonTouchTap={e => this.menuToggle()}
                  iconElementRight={
                    <IconMenu
                      iconButtonElement={
                        <IconButton><MoreVertIcon /></IconButton>
                      }
                      targetOrigin={{horizontal: 'right', vertical: 'top'}}
                      anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                    >
                      <MenuItem onTouchTap={e=> location.reload()} primaryText="Refresh" />
                      <MenuItem onTouchTap={e=> {this.setState({
                        helpOpen: true
                      });
                      }} primaryText="Feedback" />
                    </IconMenu>
                  }
                />
                <Drawer
                  open={this.state.menuOpen}
                  docked={false}
                  onRequestChange={(menuOpen) => this.setState({menuOpen})}
                >
                  <List>
                    <Subheader>Menus</Subheader>
                    <Link to="/" style={style.a}>
                      <ListItem primaryText="Notice" leftIcon={<NoticeImage />}
                                onTouchTap={e=> this.menuToggle("Notice")}/>
                    </Link>
                    <Link to="/bus" style={style.a}>
                      <ListItem primaryText="Shuttle Bus" leftIcon={<BusImage />}
                                onTouchTap={e=> this.menuToggle("Shuttle Bus")}/>
                    </Link>
                    <Subheader>Private</Subheader>
                    <Link to="/tickets" style={style.a}>
                      <ListItem primaryText="My Tickets" leftIcon={<ListImage />}
                                onTouchTap={e=> this.menuToggle("My Tickets")}/>
                    </Link>
                    <Link to="/cards" style={style.a}>
                      <ListItem primaryText="My Payment Method" leftIcon={<CardImage />}
                                onTouchTap={e=> this.menuToggle("My Payment Method")}/>
                    </Link>
                    <ListItem primaryText="Logout" leftIcon={<LogoutImage />}
                              onTouchTap={e=> alert('logout')}/>
                    <Subheader>Admin</Subheader>
                    <Link to="/admin/users" style={style.a}>
                      <ListItem primaryText="Users" leftIcon={<PersonImage />}
                                onTouchTap={e=> this.menuToggle("Users")}/>
                    </Link>
                    <Link to="/admin/bus" style={style.a}>
                      <ListItem primaryText="Bus Reserve" leftIcon={<CardImage />}
                                onTouchTap={e=> this.menuToggle("Bus Reserve")}/>
                    </Link>
                  </List>
                </Drawer>
                <div style={style.spacer}/>
                <div className="container">
                  <div className="row">
                    <div className="col-xs-12 col-md-6 col-lg-8 offset-md-3 offset-lg-2">
                      <Route exact path="/" component={Main}/>
                      <Route exact path="/cards" component={CardPage}/>
                      <Route exact path="/bus" component={BusPage}/>
                      <Route exact path="/tickets" component={TicketPage}/>

                      <Route exact path="/admin/users" component={AdminUsersPage}/>
                      <Route exact path="/admin/bus" component={AdminBusPage}/>

                    </div>
                  </div>
                </div>
              </div>)
            : (
              <div>
                <Route component={LoginPage}/>
              </div>
            )}
          <Dialog
            title="Send Message to Creator"
            actions={[
              <FlatButton
                label="Cancel"
                primary={true}
                onTouchTap={e=> this.setState({
                  helpOpen: false
                })}
              />,
              <FlatButton
                label="Send"
                secondary={true}
                onTouchTap={e=> alert('sent')}
              />
            ]}
            modal={false}
            open={this.state.helpOpen}
            onRequestClose={e=> this.setState({
              helpOpen: false
            })}
            autoScrollBodyContent={true}
          >
            <TextField
              hintText="tell me your thoughts"
              multiLine={true}
              rows={1}
              fullWidth={true}
              rowsMax={8}
            />
          </Dialog>
        </div>
      </Router>
    )
  }
}

export default Routing;

const PrivateRoute = ({component, ...rest}) => (
  <Route {...rest} render={props => (
    <Redirect to={{
      pathname: '/login',
      state: {from: props.location}
    }}/>
  )}/>
)

