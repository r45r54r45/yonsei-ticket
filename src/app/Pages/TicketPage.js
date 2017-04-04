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

const styles = {
  container: {
    position: 'relative',
  },
  preparing:{
    textAlign: 'center',
    padding: '20px'
  },
  time: {
    fontSize: '18px',
    marginTop: '5px'
  },
};

class TicketPage extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      selectedTicketType: '1',
    }
    this.changeTicketType = this.changeTicketType.bind(this);
  }

  changeTicketType(day) {
    this.setState({
      selectedTicketType: day
    })
  }

  render() {
    const {selectedTicketType} = this.state;
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
            <Tab label="Bus" value={'1'}>
              <List>
                <ListItem>
                  <div style={styles.time}>

                  </div>
                </ListItem>
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

export default TicketPage;
