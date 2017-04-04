import React, {Component} from 'react';
import CardForm from '../components/CardForm';

const styles = {
  container: {
    textAlign: 'center',
  },
};

class CardPage extends Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <div style={styles.container}>
        <CardForm
          onSubmit={e=>console.log(e)}
        />
      </div>
    );
  }
}

export default CardPage;
