const query = require('../../util/mysql');
const {ATTEMPT_BUS_RESERVATION, GET_CURRENT_RESERVATION_COUNT, GET_USER_RESERVATION_STATUS} = require('./query');

const BUS_MAX_USER_COUNT = 43;
const BUS_TICKET_PRICE = 3000;
exports.method = {
  POST: (req, res) => {
    const {dateString, timeString, fromLocation} = req.body;
    // 결제 시도
    const {payWithCard, cancelPayment} = require('../payment/util');
    const {getCardKey} = require('../payment');
    const paymentHistoryUID = `BUS_${new Date().getTime()}`;
    getCardKey(req.USER_UID)
      .then(key => {
        return payWithCard(paymentHistoryUID, key, BUS_TICKET_PRICE);
      })
      .then(result => {
        return query(ATTEMPT_BUS_RESERVATION, [req.USER_UID, dateString, timeString, fromLocation, paymentHistoryUID, BUS_MAX_USER_COUNT])
      })
      .then(result => {
        if(result[0][0].result === '0'){
          //success
          res.json({result: 0})

        }else{
          //fail 결제 취소
          return cancelPayment(BUS_TICKET_PRICE, paymentHistoryUID);
        }
      })
      .then(result => {
        res.json({result: -1, error: "seat already taken"});
      })
      .catch(error => {
        res.json({
          result: -2,
          error
        })
      })
  },
  GET: (req, res) => {
    const {dateString} = req.query;
    const userUID = req.USER_UID;
    Promise.all([
      query(GET_CURRENT_RESERVATION_COUNT, [dateString]),
      query(GET_USER_RESERVATION_STATUS, [dateString, userUID])
    ])
      .then(result => {
        const reservationStatusRaw = result[0];
        const userStatusRaw = result[1];

        const reservationStatus = {};
        reservationStatusRaw.forEach(item => {
          reservationStatus[item.TIME_STRING]=BUS_MAX_USER_COUNT - item.count;
        });

        const userStatus = {};
        userStatusRaw.forEach(item => {
          userStatus[item.TIME_STRING]=item.count!==0;
        });
        res.json({
          reservationStatus,
          userStatus,
          maxSeatCount: BUS_MAX_USER_COUNT
        });
      })
  }
}
