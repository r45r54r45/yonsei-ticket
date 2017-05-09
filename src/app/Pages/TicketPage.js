import React, {Component} from 'react';
import {Tabs, Tab} from 'material-ui/Tabs'
import Paper from 'material-ui/Paper'
import {List, ListItem} from 'material-ui/List';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Pay from 'material-ui/svg-icons/action/payment';
import Arrow from 'material-ui/svg-icons/action/trending-flat';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import Snackbar from 'material-ui/Snackbar';
import CircularProgress from 'material-ui/CircularProgress';
import {getWithAuth} from '../utils/request';
const styles = {
  container: {
    position: 'relative',
  },
  preparing: {
    textAlign: 'center',
    padding: '0px'
  },
  time: {
    fontSize: '13px',
    marginTop: '0px'
  },
  center: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
};

class TicketPage extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      selectedTicketType: 'busHistory',
      busList: [],
      loading: true
    }
    this.changeTicketType = this.changeTicketType.bind(this);
  }

  componentDidMount() {
    getWithAuth('/user?data=busHistory')
      .then(result => {
        console.log(result);
        this.setState({
          busList: result,
          loading: false
        })
      })
  }

  changeTicketType(type) {
    this.setState({
      loading: true
    })
    getWithAuth(`/user?data=${type}`)
      .then(result => {
        console.log(result);
        this.setState({
          [type]: result,
          loading: false,
        })
      })
    this.setState({
      selectedTicketType: type
    })
  }

  render() {
    const {selectedTicketType, busList, loading} = this.state;
    return (
      <div style={styles.container}>
        <Paper
          zDepth={1}
        >
          <Tabs
            value={selectedTicketType}
            onChange={this.changeTicketType}
            contentContainerStyle={styles.preparing}
          >
            <Tab label="Bus" value={'busHistory'}>
              <List>
                {loading && (
                  <div style={styles.center}>
                  <CircularProgress/>
                  </div>
                )}
                {!loading && busList.map((item, index) => {
                  return (
                    <ListItem key={index}>
                      <div style={styles.time}>
                        <div>
                          {item.DATE_STRING} {DAY_STRING[new Date(item.DATE_STRING).getDay()]}
                        </div>
                        <div>
                          {item.TIME_STRING}
                        </div>
                        <div>
                          {item.FROM_LOCATION}
                        </div>
                      </div>
                    </ListItem>
                  )
                })}
                {!loading && busList.length === 0 && (
                  <div>
                    Empty
                  </div>
                )}

              </List>
            </Tab>
            <Tab label="Akaraka" value={'2'}>
              We are preparing for this.
            </Tab>
            <Tab label="YonKo" value={'3'}>
              We are preparing for this.
            </Tab>
          </Tabs>
        </Paper>
      </div>
    );
  }
}
const DAY_STRING = {
  0: 'SUNDAY',
  1: 'MONDAY',
  2: 'TUESDAY',
  3: 'WEDNESDAY',
  4: 'THURSDAY',
  5: 'FRIDAY',
  6: "SATURDAY"
}
export default TicketPage;
