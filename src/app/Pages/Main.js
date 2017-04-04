
import React, {Component} from 'react';
import {Card, CardTitle, CardText, CardHeader} from 'material-ui/Card'
import image from '../jsa-128.jpg';

const styles = {
  container: {

  },
  cards:{
    marginBottom: '10px'
  }
};


class Main extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleRequestClose = this.handleRequestClose.bind(this);
    this.handleTouchTap = this.handleTouchTap.bind(this);

    this.state = {
      open: false,
    };
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
        <Card style={styles.cards}>
          <CardHeader
            title="Woohyun Kim"
            subtitle="UIC Admin"
            avatar={image}
            actAsExpander={true}
            showExpandableButton={true}
          />
          <CardTitle title="Website is on construction" subtitle="2017-03-24 14:34" />
          <CardText expandable={true}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
            Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
            Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
          </CardText>
        </Card>

        <Card style={styles.cards}>
          <CardHeader
            title="Woohyun Kim"
            subtitle="UIC Admin"
            avatar={image}
            actAsExpander={true}
            showExpandableButton={true}
          />
          <CardTitle title="Website is on construction" subtitle="2017-03-24 14:34" />
          <CardText expandable={true}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
            Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
            Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
          </CardText>
        </Card>
      </div>
    );
  }
}

export default Main;
