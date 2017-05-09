
import React, {Component} from 'react';
import {Card, CardTitle, CardText, CardHeader} from 'material-ui/Card'
import image from '../jsa-128.jpg';
import {postWithAuth, post, getWithAuth, get}  from '../utils/request';
import CircularProgress from 'material-ui/CircularProgress'
const styles = {
  container: {

  },
  cards:{
    marginBottom: '10px'
  },
  center: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
};


class Main extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleRequestClose = this.handleRequestClose.bind(this);
    this.handleTouchTap = this.handleTouchTap.bind(this);

    this.state = {
      open: false,
      noticeList: []
    };
  }

  componentDidMount(){
    get('/notice')
      .then(result=>{
        this.setState({
          noticeList: result
        })
      })
  }
  handleRequestClose() {
    this.setState({
      open: false,
    });
  }

  handleTouchTap() {

    this.setState({
      open: true,
    });
  }

  render() {
    return (
      <div style={styles.container}>
        {this.state.noticeList.length ===0 && (
          <div style={styles.center}>
            <CircularProgress/>
          </div>
        )}
        {this.state.noticeList.map((notice, index)=>{
          return (
            <Card style={styles.cards} key={index}>
              <CardHeader
                title={notice.USER_NAME}
                subtitle="UIC Admin"
                avatar={image}
                actAsExpander={true}
                showExpandableButton={true}
              />
              <CardTitle title={notice.TITLE} subtitle={new Date(notice.CREATED_AT).toLocaleString()} />
              <CardText expandable={true}>
                <div dangerouslySetInnerHTML={{__html: notice.CONTENT}}>
                </div>
              </CardText>
            </Card>
          )
        })}
      </div>
    );
  }
}

export default Main;
