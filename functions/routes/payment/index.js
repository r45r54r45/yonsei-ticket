const query = require('../../util/mysql');
const {INSERT_NEW_CARD_INFO, GET_USER_CARD_INFO, GET_USER_CARD_KEY, DELETE_USER_CARD} = require('./query');
exports.method = {
  POST: (req, res) => {
    const {cardNum, cardDate, birth, cardPw} = req.body;
    const {registerNewCard, payWithCard, cancelPayment} = require('./util');
    const createdTime = new Date().getTime();
    const cardKey = "CARD" + createdTime;
    let cardNameRaw = null;
    registerNewCard(cardKey, cardNum, cardDate, birth, cardPw)
      .then(result => {
        cardNameRaw = result.response.card_name;
        if (result.result) {
          return payWithCard("TEST" + createdTime, cardKey, 1000);
        }
        else {
          res.json({
            result: false
          })
        }
      })
      .then(paySuccess => {
        console.log("paySuccess", paySuccess)
        return cancelPayment(1000, "TEST" + createdTime);
      })
      .then(cancelSuccess => {
        console.log("cancelSuccess", cancelSuccess)
        const cardName = cardNameRaw + " (" + cardNum.substring(0, 10) + "****" + cardNum.substring(14, 19) + ")";
        const USER_UID = req.USER_UID;
        query(INSERT_NEW_CARD_INFO, [USER_UID, cardKey, cardName])
          .then(inserted => {
            console.log(inserted);
            res.json({
              inserted,
              cardName,
              createdTime
            })
          })
      })
      .catch(error => {
        console.log(error);
        res.json({
          result: false,
          error
        })
      })
  },
  GET: (req, res) => {
    const USER_UID = req.USER_UID;
    query(GET_USER_CARD_INFO, [USER_UID])
      .then(result => {
        res.json(result);
      })
  },
  DELETE: (req, res) => {
    const USER_UID = req.USER_UID;
    query(DELETE_USER_CARD, [USER_UID])
      .then(result => {
        res.json(result);
      })
  }
};
exports.getCardKey = (userUID) => {
  return new Promise((resolve, reject) => {
    query(GET_USER_CARD_KEY, [userUID])
      .then(keyList => {
        if (keyList.length === 0) {
          reject("no available card");
        } else {
          const targetKey = keyList[0].PAYMENT_METHOD_KEY;
          resolve(targetKey);
        }
      })
  })

};
