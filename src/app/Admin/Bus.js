import React, {Component} from 'react';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import {blue200} from 'material-ui/styles/colors';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

const styles = {
  container: {
    padding: '10px',
    title: {
      paddingLeft: '20px',
      color: blue200
    },
    selects:{
      display: 'flex',
      flexWrap: 'wrap'
    }
  },
  table: {
    headerId: {
      width: '30px'
    }
  },
  select:{
    width: '130px',
    marginRight: '10px'
  }
};
class BusManagePage extends Component {
  constructor(props, context) {
    super(props, context);
    let currentDay = parseInt(new Date().getDay());
    this.state = {
      criteria: {
        day: null,
        from: null,
        time: null
      }
    }
    this.selectCriteria = this.selectCriteria.bind(this);
  }

  selectCriteria(key, value) {
    if(key === 'day'){
      this.setState({
        criteria: Object.assign(this.state.criteria, {
          day : value,
          from: null,
          time: null
        })
      })
    }else if(key === 'from'){
      this.setState({
        criteria: Object.assign(this.state.criteria, {
          from: value,
          time: null
        })
      })
    }else{
      this.setState({
        criteria: Object.assign(this.state.criteria, {
          time: value
        })
      })
      //TODO fetch lists
    }


  }

  render() {
    return (
      <div>
        <Paper
          zDepth={1}
          style={styles.container}
        >
          <div style={styles.container.title}>
            <h3>Manage Bus Reservation</h3>
          </div>
          <div style={styles.container.selects}>
              <SelectField
                style={styles.select}
                floatingLabelFixed
                floatingLabelText="Day"
                value={this.state.criteria.day}
                onChange={(a,b,c)=>this.selectCriteria('day',c)}
                autoWidth={true}
              >
                <MenuItem value={null} primaryText=""/>
                <MenuItem value={'1'} primaryText="Monday"/>
                <MenuItem value={'2'} primaryText="Tuesday"/>
                <MenuItem value={'3'} primaryText="Wednesday"/>
                <MenuItem value={'4'} primaryText="Thursday"/>
                <MenuItem value={'0'} primaryText="Sunday"/>
              </SelectField>
            {this.state.criteria.day !== null && (
              <SelectField
                style={styles.select}
                floatingLabelText="From"
                floatingLabelFixed
                value={this.state.criteria.from}
                onChange={(a,b,c)=>this.selectCriteria('from',c)}
                autoWidth={true}
              >
                <MenuItem value={null} primaryText=""/>
                {busSchedule[this.state.criteria.day].from.map((from,index) => {
                  return (
                    <MenuItem value={index} primaryText={from.value} key={from.value}/>
                  )
                })}
              </SelectField>
            )}
            {this.state.criteria.from !== null && (
              <SelectField
                style={styles.select}
                floatingLabelText="Time"
                floatingLabelFixed
                value={this.state.criteria.time}
                onChange={(a,b,c)=>this.selectCriteria('time',c)}
                autoWidth={true}
              >
                <MenuItem value={null} primaryText=""/>
                {busSchedule[this.state.criteria.day].from[this.state.criteria.from].time.map(time => {
                  return (
                    <MenuItem value={time} primaryText={time} key={time}/>
                  )
                })}
              </SelectField>
            )}
          </div>
          <Paper
            zDepth={2}
          >
            <Table>
              <TableHeader displaySelectAll={false}
                           adjustForCheckbox={false}>
                <TableRow>
                  <TableHeaderColumn style={styles.table.headerId}>ID</TableHeaderColumn>
                  <TableHeaderColumn>Student Num</TableHeaderColumn>
                  <TableHeaderColumn>Name</TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody displayRowCheckbox={false}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44].map((row, index) => {
                  return (
                    <TableRow key={index}>
                      <TableRowColumn style={styles.table.headerId}>{index}</TableRowColumn>
                      <TableRowColumn>2014198024</TableRowColumn>
                      <TableRowColumn>woohyun</TableRowColumn>
                    </TableRow>
                  )
                })}

              </TableBody>
            </Table>
          </Paper>
        </Paper>
      </div>
    );
  }
}

export default BusManagePage;

export const busSchedule = {
  '1': {
    from: [
      {
        value: 'shinchon',
        time: [
          '17:30', '22:30'
        ]
      },
      // {
      //   value: 'songdo',
      //   time: [
      //     '08:30'
      //   ]
      // }
    ]
  },
  '2': {
    from: [
      {
        value: 'shinchon',
        time: [
          '17:30', '22:30'
        ]
      },
      // {
      //   value: 'songdo',
      //   time: [
      //     '08:30'
      //   ]
      // }
    ]
  },
  '3': {
    from: [
      {
        value: 'shinchon',
        time: [
          '17:30', '22:30'
        ]
      },
      // {
      //   value: 'songdo',
      //   time: [
      //     '08:30'
      //   ]
      // }
    ]
  },
  '4': {
    from: [
      {
        value: 'shinchon',
        time: [
          '17:30', '22:30'
        ]
      },
      // {
      //   value: 'songdo',
      //   time: [
      //     '08:30'
      //   ]
      // }
    ]
  },
  '0': {
    from: [
      {
        value: 'shinchon',
        time: [
          '19:00'
        ]
      }
    ]
  }
}
