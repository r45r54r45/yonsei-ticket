import React, {Component} from 'react';
import {Tabs, Tab} from 'material-ui/Tabs'
import Paper from 'material-ui/Paper'
import {busSchedule} from '../Admin/Bus'
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
    loading: {
      position: 'absolute',
      background: 'rgba(0,0,0,.3)',
      left: '0',
      top: '0',
      zIndex: '1299',
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  },
  button: {
    top: '6px',
    right: '13px',
    icon: {}

  },
  dest: {
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center'
  },
  time: {
    fontSize: '18px',
    marginTop: '5px'
  },
  desc: {
    fontSize: '12px',
    textAlign: 'center',
    padding: '5px'
  },
  seat: {
    fontSize: '13px'
  }
};

class BusPage extends Component {
  constructor(props, context) {
    super(props, context);
    const now = new Date();
    this.day =  now.getDay();
    this.month = now.getMonth()+1;
    this.date = now.getDate();
    if([1,2,3,4,0].indexOf(this.day) === -1){
      this.day = 0;
    }
    this.state = {
      selectedDay: this.day.toString(),
      paymentStarted: false
    }
    this.changeDay = this.changeDay.bind(this);
  }

  changeDay(day) {
    this.setState({
      selectedDay: day
    })
  }

  render() {
    const {selectedDay} = this.state;
    return (
      <div style={styles.container}>
        {this.state.paymentStarted && (
          <div style={styles.container.loading}>
            <CircularProgress />
          </div>
        )}
        <Paper
          zDepth={1}
        >
          <Tabs
            value={selectedDay}
            onChange={this.changeDay}
          >
            <Tab label="Mon" value={'1'}/>
            <Tab label="Tue" value={'2'}/>
            <Tab label="Wed" value={'3'}/>
            <Tab label="Thu" value={'4'}/>
            <Tab label="Sun" value={'0'}/>
          </Tabs>
          <div>
            <List>
              <Subheader>FROM SHINCHON ({isNextWeek(this.day,parseInt(selectedDay))? `${nextWeek(selectedDay).month}/${nextWeek(selectedDay).date}` : `${currentWeek(selectedDay).month}/${currentWeek(selectedDay).date}`})</Subheader>
              {busSchedule[selectedDay].from[0].time.map(time => {
                return (
                  <ListItem rightIconButton={
                    <FloatingActionButton
                      mini={true}
                      style={styles.button}
                      iconStyle={styles.button.icon}
                      onTouchTap={e => {
                        this.setState({
                          paymentStarted: true
                        });
                        setTimeout(() => {
                          this.setState({
                            paymentStarted: false
                          })
                        }, 1000)
                      }}
                    >
                      <Pay />
                    </FloatingActionButton>
                  }>
                    <div style={styles.time}>
                      {time} <span style={styles.seat}>( 3 left )</span>
                    </div>
                  </ListItem>
                )
              })}
            </List>
            {busSchedule[selectedDay].from[1] && (
              <Divider/>
            )}
            <List>
              {busSchedule[selectedDay].from[1] && (
                <Subheader>FROM SONGDO</Subheader>
              )}
              {busSchedule[selectedDay].from[1] && busSchedule[selectedDay].from[1].time.map(time => {
                return (
                  <ListItem rightIconButton={
                    <FloatingActionButton mini={true} style={styles.button}>
                      <Pay />
                    </FloatingActionButton>
                  }>
                    <div style={styles.time}>
                      {time} <span style={styles.seat}>( 3 left )</span>
                    </div>
                  </ListItem>
                )
              })}
            </List>
            <Divider/>
            <div style={styles.desc}>
              If the seat is not available, your payment will be immediately refunded.
            </div>
          </div>
        </Paper>
        <Snackbar
          open={this.state.paymentStarted}
          message={"We are now processing your payment..."}
          onRequestClose={e => e => this.setState({
            paymentStarted: false
          })}
        />
      </div>
    );
  }
}

export default BusPage;

function nextWeek(targetDay){
  //다음주의 해당 day에 해당하는 월/일을 반환
  const time = new Date();
  const day = time.getDay();
  if(day === 0 ){
    time.setDate(time.getDate()+parseInt(targetDay));
    return {
      month: time.getMonth()+1,
      date: time.getDate()
    }
  }else{
    time.setDate(time.getDate()+7-day+parseInt(targetDay));
    return {
      month: time.getMonth()+1,
      date: time.getDate()
    }
  }
}
function currentWeek(targetDay){
  const time = new Date();
  if(time.getDay() === 0){
    return {
      month: time.getMonth()+1,
      date: time.getDate()
    }
  }else{
    time.setDate(time.getDate() + time.getDay()-1 + targetDay -1);
    return {
      month: time.getMonth()+1,
      date: time.getDate()
    }
  }
}

function isNextWeek(currentDay, selectedDay){
  if(currentDay === 0){
    if(selectedDay === 0){
      return false;
    }else{
      return true;
    }
  }else{
    if(selectedDay === 0){
      return false;
    }else if(selectedDay === currentDay){
      return false;
    }else{
      return true;
    }
  }
}
