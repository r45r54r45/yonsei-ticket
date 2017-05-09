import React, {Component} from 'react';
import {Tabs, Tab} from 'material-ui/Tabs'
import Paper from 'material-ui/Paper'
import {busSchedule} from '../Admin/Bus'
import {List, ListItem} from 'material-ui/List';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Pay from 'material-ui/svg-icons/action/payment';
import Refresh from 'material-ui/svg-icons/navigation/refresh';
import Arrow from 'material-ui/svg-icons/action/trending-flat';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import Snackbar from 'material-ui/Snackbar';
import CircularProgress from 'material-ui/CircularProgress';
import IconButton from 'material-ui/IconButton';
import {postWithAuth, getWithAuth} from '../utils/request';
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
  },
  refresh: {
    display: 'inline-block',
    position: 'relative',
  },
};

class BusPage extends Component {
  constructor(props, context) {
    super(props, context);
    const now = new Date();
    this.day = now.getDay();
    this.month = now.getMonth() + 1;
    this.date = now.getDate();
    this.year = now.getFullYear();
    this.state = {
      selectedDay: [1, 2, 3, 4, 0].indexOf(this.day) === -1 ? '0' : this.day.toString(),
      loadingStarted: true,
      paymentStarted: false,
      data: {
        reservationStatus: {},
        userStatus: {},
        maxSeatCount: null
      }
    }
    this.changeDay = this.changeDay.bind(this);
    this.buy = this.buy.bind(this);
    this.updateReservationStatus = this.updateReservationStatus.bind(this);
  }
  componentDidMount(){
    this.updateReservationStatus(this.year + "/" + getDateTimeString(this.day, parseInt(this.state.selectedDay)));
  }

  changeDay(day) {
    this.setState({
      selectedDay: day
    })
    this.updateReservationStatus(this.year + "/" + getDateTimeString(this.day, parseInt(day)));
  }

  updateReservationStatus(dateString) {
    this.setState({
      loadingStarted: true
    });
    getWithAuth(`/reservation?dateString=${dateString}`)
      .then(result => {
        this.setState({
          data: Object.assign(this.state.data, {
            reservationStatus: result.reservationStatus,
            userStatus: result.userStatus,
            maxSeatCount: result.maxSeatCount
          }),
          loadingStarted: false
        })
      })
  }

  buy(disabled, dateString, timeString, fromLocation) {
    if(disabled){
      return;
    }
    this.setState({
      loadingStarted: true,
      paymentStarted: true
    });
    postWithAuth('/reservation', {
      dateString,
      timeString,
      fromLocation
    })
      .then(result => {
        if(result.result !== 0){
          alert(result.error);
        }else{
          alert('Successfully reserved your seat!')
        }
        this.setState({
          paymentStarted: false
        });
        this.updateReservationStatus(dateString);
      })
  }

  render() {
    const {selectedDay, data, loadingStarted} = this.state;
    return (
      <div style={styles.container}>
        {loadingStarted && (
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
              <Subheader>FROM SHINCHON ({getDateTimeString(this.day, parseInt(selectedDay))})</Subheader>
              {busSchedule[selectedDay].from[0].time.map(time => {
                const disabled = loadingStarted || data.userStatus[time] || data.reservationStatus[time] === 0;
                return (
                  <ListItem key={time} rightIconButton={
                    <FloatingActionButton
                      mini={true}
                      disabled={disabled}
                      style={styles.button}
                      iconStyle={styles.button.icon}
                    >
                      <Pay
                        onTouchTap={() => this.buy(disabled, `${this.year}/${getDateTimeString(this.day, parseInt(selectedDay))}`, time, 'SHINCHON')}/>
                    </FloatingActionButton>
                  }>
                    <div style={styles.time}>
                      {time} <span style={styles.seat}>( {data.reservationStatus[time] || data.maxSeatCount} remaining )</span>
                    </div>
                  </ListItem>
                )
              })}
            </List>
            {/*{busSchedule[selectedDay].from[1] && (*/}
              {/*<Divider/>*/}
            {/*)}*/}
            {/*<List>*/}
              {/*{busSchedule[selectedDay].from[1] && (*/}
                {/*<Subheader>FROM SONGDO</Subheader>*/}
              {/*)}*/}
              {/*{busSchedule[selectedDay].from[1] && busSchedule[selectedDay].from[1].time.map(time => {*/}
                {/*return (*/}
                  {/*<ListItem key={time} rightIconButton={*/}
                    {/*<FloatingActionButton mini={true} style={styles.button}>*/}
                      {/*<Pay />*/}
                    {/*</FloatingActionButton>*/}
                  {/*}>*/}
                    {/*<div style={styles.time}>*/}
                      {/*{time} <span style={styles.seat}>( 3 left )</span>*/}
                    {/*</div>*/}
                  {/*</ListItem>*/}
                {/*)*/}
              {/*})}*/}
            {/*</List>*/}
            <Divider/>
            <div style={styles.desc}>
              If the seat is not available, your payment will be immediately refunded.
            </div>
          </div>
          <div style={{textAlign: 'center', padding: '10px 0'}}>
            <Refresh onTouchTap={() =>  this.updateReservationStatus(this.year + "/" + getDateTimeString(this.day, parseInt(selectedDay)))}/>
          </div>
        </Paper>
        <Snackbar
          open={this.state.paymentStarted}
          message={"We are now processing your payment..."}
          onRequestClose={e =>  this.setState({
            paymentStarted: false
          })}
        />
      </div>
    );
  }

}

export default BusPage;

function nextWeek(targetDay) {
  const target = parseInt(targetDay);
  //다음주의 해당 day에 해당하는 월/일을 반환
  const time = new Date();
  const currentDay = time.getDay();

  if (currentDay === 0) {
    time.setDate(time.getDate() + target);
  } else {
    time.setDate(time.getDate() + 7 - currentDay + target);
  }
  return {
    month: time.getMonth() + 1,
    date: time.getDate()
  }
}
function currentWeek(targetDay) {
  const target = parseInt(targetDay);
  const time = new Date();
  const currentDay = time.getDay();
  if (target === 0) {
    if (currentDay === 0) {
      time.setDate(time.getDate());
    } else {
      time.setDate(time.getDate() + 7 - currentDay)
    }

  } else {
    time.setDate(time.getDate() + target - currentDay)
  }
  return {
    month: time.getMonth() + 1,
    date: time.getDate()
  }

}

function isNextWeek(currentDay, selectedDay) {
  const target = parseInt(selectedDay);
  if (target === 0) {
    return false;
  } else {
    return (target < currentDay);
  }
}
function getDateTimeString(currentDay, selectedDay) {
  if (isNextWeek(currentDay, selectedDay)) {
    let time = nextWeek(selectedDay);
    return `${time.month}/${time.date}`;
  } else {
    let time = currentWeek(selectedDay);
    return `${time.month}/${time.date}`;
  }
}
