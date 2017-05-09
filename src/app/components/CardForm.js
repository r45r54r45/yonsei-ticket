import React, {Component} from 'react';
import TextField from 'material-ui/TextField'
import {Tabs, Tab} from 'material-ui/Tabs';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress'
import Paper from 'material-ui/Paper'
import Snackbar from 'material-ui/Snackbar';
import {Card, CardHeader, CardActions} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton'
import Dialog from 'material-ui/Dialog';
import {postWithAuth, getWithAuth, deleteWithAuth} from '../utils/request';
const style = {
  newCard: {
    wrapper: {
      display: 'flex',
      flexDirection: 'column',
      padding: '30px'
    },
    direction: {
      fontSize: '12px'
    }
  },
  buttonWrapper: {
    padding: '20px 0px 0px'
  },
  loading: {
    position: 'absolute',
    margin: '0px',
    left: '50%',
    marginLeft: '-25px',
    top: '50%',
    marginTop: '-25px'
  },
};
class CardForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: 'new card',
      newCardInfo: {
        password: '',
        expiry: '',
        birth: '',
        cardNum: ''
      },
      prevCardInfo: {
        PAYMENT_METHOD_UID: null,
        cardName: null,
        createdTime: null
      },
      error: {
        expiry: false,
        cardNum: false
      },
      success: false,
      fail: false,
      submitting: false,
      deleteSuccess: false,
      noCard: false,
      deleteCardDialog: false,
      loaded: false
    }
    this.onTabChange = this.onTabChange.bind(this);
    this.onPasswordChange = this.onPasswordChange.bind(this);
    this.onDateChange = this.onDateChange.bind(this);
    this.onBirthChange = this.onBirthChange.bind(this);
    this.onCardNumChange = this.onCardNumChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.closeSuccessSnackBar = this.closeSuccessSnackBar.bind(this);
    this.closeFailSnackBar = this.closeFailSnackBar.bind(this);
    this.deleteCard = this.deleteCard.bind(this);
    this.deleteCardRequest = this.deleteCardRequest.bind(this);
    this.closeCardDeleteSuccessSnackBar = this.closeCardDeleteSuccessSnackBar.bind(this);
  }
  componentDidMount(){
    getWithAuth('/payment')
      .then(result => {
        if(result.length !== 0){
          this.setState(Object.assign(this.state, {
            prevCardInfo: {
              PAYMENT_METHOD_UID: result[0].PAYMENT_METHOD_UID,
              cardName: result[0].PAYMENT_METHOD_INFO,
              createdTime: result[0].CREATED_AT
            },
            loaded: true,
            selected: 'registered card',
          }))
        }else{
          this.setState(Object.assign(this.state, {
            loaded: true,
            selected: 'new card',
          }))
        }
      })
  }
  render() {
    return (
      <div>
        {!this.state.loaded && (
          <CircularProgress/>
        )}
        {this.state.loaded && (
          <Paper
            zDepth={1}
          >
            <Tabs
              value={this.state.selected}
              onChange={this.onTabChange}
            >
              <Tab label="Registered Card" value="registered card">
                <Card>SERVER
                  <CardHeader
                    title={this.state.prevCardInfo.cardName}
                    subtitle={"ADDED DATE: "+ new Date(this.state.prevCardInfo.createdTime).toLocaleString()}
                  />
                  <CardActions>
                    <FlatButton label="Delete" onTouchTap={this.deleteCardRequest}/>
                  </CardActions>
                </Card>
              </Tab>

              <Tab label="New Card" value="new card">
                <div style={style.newCard.wrapper}>
                  <abbr className="lead" style={style.newCard.direction}>
                    During registration process, 1,000 won will be charged to your card and will be immediately cancelled
                    after verification process. So don't be surprised.
                  </abbr>
                  <TextField
                    ref={ref => this.cardNum = ref}
                    fullWidth={true}
                    hintText="Hint Text"
                    floatingLabelText="Card Number"
                    onChange={this.onCardNumChange}
                    value={this.state.newCardInfo.cardNum}
                    errorText={this.state.error.cardNum}
                    disabled={this.state.submitting}
                  />
                  <TextField
                    ref={ref => this.birth = ref}
                    hintText="941009"
                    maxLength="6"
                    floatingLabelText="Date of Birth"
                    onChange={this.onBirthChange}
                    value={this.state.newCardInfo.birth}
                    disabled={this.state.submitting}
                  />
                  <TextField
                    ref={ref => this.expiry = ref}
                    hintText="YYYY/MM"
                    floatingLabelText="Expiry Date"
                    onChange={this.onDateChange}
                    value={this.state.newCardInfo.expiry}
                    errorText={this.state.error.expiry}
                    disabled={this.state.submitting}
                  />
                  <TextField
                    ref={ref => this.password = ref}
                    type="password"
                    hintText="**"
                    floatingLabelText="First 2 digits of password"
                    onChange={this.onPasswordChange}
                    value={this.state.newCardInfo.password}
                    disabled={this.state.submitting}
                  />
                </div>
                <div style={style.buttonWrapper}>
                  <RaisedButton disabled={this.state.submitting} onClick={this.onSubmit}
                                label={this.state.submitting ?
                                  <CircularProgress style={style.loading} size={.3}/> : "ADD CARD"}
                                fullWidth={true} primary={true}/>
                </div>
              </Tab>
            </Tabs>
          </Paper>
        )}
        <Snackbar
          open={this.state.success}
          message="Card has been successfully added"
          autoHideDuration={1000}
          onRequestClose={this.closeSuccessSnackBar}
        />
        <Snackbar
          open={this.state.fail}
          message="Error occured. Please try again"
          autoHideDuration={2000}
          onRequestClose={this.closeFailSnackBar}
        />
        <Snackbar
          open={this.state.deleteSuccess}
          message="Card Delete Success"
          autoHideDuration={1000}
          onRequestClose={this.closeCardDeleteSuccessSnackBar}
        />
        <Snackbar
          open={this.state.noCard}
          message="No card registered. Please add new card"
          autoHideDuration={1000}
        />
        <Dialog
          title="Delete Confirmation"
          actions={[
            <FlatButton
              label="Cancel"
              primary={true}
              onTouchTap={e => this.setState({
                deleteCardDialog: false
              })}
            />,
            <FlatButton
              label="Delete"
              primary={true}
              // keyboardFocused={true}
              onTouchTap={this.deleteCard}
            />
          ]}
          modal={false}
          open={this.state.deleteCardDialog}
          // onRequestClose={this.handleClose}
        >
          Do you really want to delete card?
        </Dialog>
      </div>
    )
  }

  closeSuccessSnackBar() {
    this.setState({
      success: false
    })
  }

  closeFailSnackBar() {
    this.setState({
      fail: false
    })
  }

  onSubmit() {
    const {password, expiry, birth, cardNum} = this.state.newCardInfo;
    if (!this.state.submitting) {
      if (cardNum.length !== 19 || this.state.error.cardNum) {
        this.cardNum.focus();
        return;
      }
      if (birth.length !== 6) {
        this.birth.focus();
        return;
      }
      if (expiry.length !== 7 || this.state.error.expiry) {
        this.expiry.focus();
        return;
      }
      if (password.length !== 2) {
        this.password.focus();
        return;
      }
      this.setState({
        submitting: true
      })
      // cardNum, cardDate, birth, cardPw
      postWithAuth('/payment',{
        cardNum: cardNum,
        cardDate: expiry,
        birth: birth,
        cardPw: password
      })
        .then(result=>{
          console.log(result);
          this.setState({
            success: true,
            selected: 'registered card',
            newCardInfo: {
              password: '',
              expiry: '',
              birth: '',
              cardNum: ''
            },
            prevCardInfo: {
              PAYMENT_METHOD_UID: result.inserted.insertId,
              cardName: result.cardName,
              createdTime: result.createdTime
            },
            error: {
              expiry: false,
              cardNum: false
            },
            submitting: false
          })
        })
    }
    function toServer() {
      return new Promise((resolve, reject) => {
        setTimeout(e => resolve(), 2000)
      })
    }
  }

  onCardNumChange(e) {
    const value = e.target.value;

    function cc_format(value) {
      var v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
      var matches = v.match(/\d{4,16}/g);
      var match = matches && matches[0] || ''
      var parts = []

      for (let i = 0, len = match.length; i < len; i += 4) {
        parts.push(match.substring(i, i + 4))
      }

      if (parts.length) {
        return parts.join(' ')
      } else {
        return value
      }
    }

    function valid_credit_card(value) {
      // accept only digits, dashes or spaces
      if (/[^0-9-\s]+/.test(value)) return false;

      // The Luhn Algorithm. It's so pretty.
      var nCheck = 0, nDigit = 0, bEven = false;
      value = value.replace(/\D/g, "");

      for (var n = value.length - 1; n >= 0; n--) {
        var cDigit = value.charAt(n),
          nDigit = parseInt(cDigit, 10);

        if (bEven) {
          if ((nDigit *= 2) > 9) nDigit -= 9;
        }

        nCheck += nDigit;
        bEven = !bEven;
      }

      return (nCheck % 10) == 0;
    }

    this.setState({
      newCardInfo: Object.assign(this.state.newCardInfo, {
        cardNum: cc_format(value)
      }),
      error: Object.assign(this.state.error, {
        cardNum: false
      })
    })
    if (value.replace(/ /g, '').length === 16) {
      if (valid_credit_card(value.replace(/ /g, ''))) {
        this.birth.focus()
      } else {
        this.setState({
          error: Object.assign(this.state.error, {
            cardNum: 'Invalid Card Number'
          })
        })
      }
    }
  }

  onBirthChange(e) {
    const value = e.target.value;

    if (value.length < 7) {
      this.setState({
        newCardInfo: Object.assign(this.state.newCardInfo, {
          birth: value
        })
      })
    }
    if (value.length === 6) {
      this.expiry.focus();
    }
  }

  onTabChange(v) {
    if (["registered card", "new card"].indexOf(v) !== -1) {
      if (v === "registered card") {
        if(!this.state.prevCardInfo.PAYMENT_METHOD_UID){
          this.setState({
            noCard: true
          })
        }else{
          this.setState({
            selected: v
          })
        }
      } else {
        if(this.state.prevCardInfo.PAYMENT_METHOD_UID){
          alert('You must delete your previous card first');
        }else{
          this.setState({
            selected: v
          })
        }
      }
    }
  }

  onPasswordChange(e) {

    if (e.target.value.length < 3) {
      this.setState({
        newCardInfo: Object.assign(this.state.newCardInfo, {
          password: e.target.value
        })
      })
    }
  }

  onDateChange(e) {

    const value = e.target.value;
    if (this.state.newCardInfo.expiry === value + '/') {
      this.setState({
        newCardInfo: Object.assign(this.state.newCardInfo, {
          expiry: value.slice(0, value.length)
        })
      })
    } else {
      if (value.length < 8) {
        if (value.length === 4) {
          this.setState({
            newCardInfo: Object.assign(this.state.newCardInfo, {
              expiry: value + "/"
            })
          })
        } else if (value.length === 6) {
          if (value.split('/')[1] > 1) {
            this.setState({
              newCardInfo: Object.assign(this.state.newCardInfo, {
                expiry: this.state.newCardInfo.expiry + "0" + value.split('/')[1]
              }),
              error: Object.assign(this.state.error, {
                expiry: false
              })
            })
            this.password.focus();
          } else { // is 1
            this.setState({
              newCardInfo: Object.assign(this.state.newCardInfo, {
                expiry: value
              }),
              error: Object.assign(this.state.error, {
                expiry: false
              })
            })
          }
        } else if (value.length === 7) {
          if (value.split('/')[1] > 12) {
            this.setState({
              newCardInfo: Object.assign(this.state.newCardInfo, {
                expiry: value
              }),
              error: Object.assign(this.state.error, {
                expiry: "Not in right format"
              })
            })
          } else {
            this.setState({
              newCardInfo: Object.assign(this.state.newCardInfo, {
                expiry: value
              })
            })
            this.password.focus();
          }
        } else {
          this.setState({
            newCardInfo: Object.assign(this.state.newCardInfo, {
              expiry: value
            })
          })
        }
      }
    }
  }
  closeCardDeleteSuccessSnackBar() {
    this.setState({
      deleteSuccess: false
    })
  }
  deleteCardRequest(){
    this.setState({
      deleteCardDialog:true
    })
  }
  deleteCard() {
    deleteWithAuth('/payment', {})
      .then(result => {
        this.setState({
          prevCardInfo: {
            PAYMENT_METHOD_UID: null,
            cardName: null,
            createdTime: null
          },
          deleteSuccess: true,
          selected: 'new card',
          deleteCardDialog:false
        })
      })
  }
}

export default CardForm;
