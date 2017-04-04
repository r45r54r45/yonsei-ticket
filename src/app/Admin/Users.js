import React, {Component} from 'react';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import {blue200} from 'material-ui/styles/colors';
const styles = {
  container: {
    padding: '10px',
    title: {
      paddingLeft: '20px',
      color: blue200
    }
  },
  table: {
    headerId: {
      width: '30px'
    }
  }
};

class UsersPage extends Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <div>
        <Paper
          zDepth={1}
          style={styles.container}
        >
          <div style={styles.container.title}>
            <h3>Manage Users</h3>
          </div>
          <Table>
            <TableHeader displaySelectAll={false}
                         adjustForCheckbox={false}>
              <TableRow>
                <TableHeaderColumn style={styles.table.headerId}>ID</TableHeaderColumn>
                <TableHeaderColumn>Student Num</TableHeaderColumn>
                <TableHeaderColumn>Name</TableHeaderColumn>
                <TableHeaderColumn>Sign in Date</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false}>
              {[1, 2, 3, 4, 5].map((row, index) => {
                return (
                  <TableRow key={index}>
                    <TableRowColumn style={styles.table.headerId}>{index}</TableRowColumn>
                    <TableRowColumn>2014198024</TableRowColumn>
                    <TableRowColumn>woohyun</TableRowColumn>
                    <TableRowColumn>{new Date().toLocaleDateString()}</TableRowColumn>
                  </TableRow>
                )
              })}

            </TableBody>
          </Table>
        </Paper>
      </div>
    );
  }
}

export default UsersPage;
