const request = require('request');

function splitAndFormatCardNum(cardNum) {
  cardNum = cardNum.replace(/\s/g, "");
  const p1 = cardNum.substring(0, 4);
  const p2 = cardNum.substring(4, 8);
  const p3 = cardNum.substring(8, 12);
  const p4 = cardNum.substring(12, 16);
  return `${p1}-${p2}-${p3}-${p4}`;
}
function formatCardDate(cardDate) {
  const part = cardDate.split('/');
  return `${part[0]}-${part[1]}`;
}
function getAccessToken() {
  return new Promise((resolve, reject) => {
    const options = {
      method: 'POST',
      url: 'https://api.iamport.kr/users/getToken',
      headers: {
        'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW',
      },
      formData: {
        imp_key: '1099446916964527',
        imp_secret: 'McqgF8kQdfODGtyM9trC4IkaP8LScKBZX2fCaAtoPi1wLAjV4Kx8tSji15bdPMdMPtp04SoTbqqW1JR5',
      },
    };

    request(options, (error, response, body) => {
      if (error) throw new Error(error);
      resolve(JSON.parse(body).response.access_token);
    });
  });
}
exports.registerNewCard = function(cardKey, cardNum, cardDate, birth, cardPw) {
  return new Promise((resolve, reject) => {
    getAccessToken().then((token) => {
      const options = {
        method: 'POST',
        url: `https://api.iamport.kr/subscribe/customers/${cardKey}`,
        headers: {
          'x-imptokenheader': token,
        },
        formData: {
          customer_uid: cardKey,
          card_number: splitAndFormatCardNum(cardNum),
          expiry: formatCardDate(cardDate),
          birth,
          pwd_2digit: cardPw,
        },
      };
      request(options, (error, response, body) => {
        if (error) {
          console.log('카드 등록 에러', error);
          reject(error);
        }
        const result = JSON.parse(body);
        console.log(result);
        resolve({
          result: result.code === 0,
          response: result.response,
          message: result.message,
        });
      });
    });
  });
}
exports.payWithCard =  function(orderUID, cardUID, price) {
  return new Promise((resolve, reject) => {
    getAccessToken().then((token) => {
      const options = {
        method: 'POST',
        url: 'https://api.iamport.kr/subscribe/payments/again',
        headers: {
          'x-imptokenheader': token,
          'content-type': 'multipart/form-data;',
        },
        formData: {
          customer_uid: cardUID,
          merchant_uid: orderUID,
          amount: price,
        },
      };

      request(options, (error, response, body) => {
        if (error) throw new Error(error);
        const result = JSON.parse(body);
        if (result.code === 0) {
          resolve(true);
        } else {
          reject('결제 실패');
        }
      });
    });
  });
}

exports.cancelPayment = function(cancel_amount, orderUID) {
  return new Promise((resolve, reject) => {
    getAccessToken().then((token) => {
      let options;
      if (!cancel_amount) {
        options = {
          method: 'POST',
          url: 'https://api.iamport.kr/payments/cancel',
          headers: {
            'x-imptokenheader': token,
            'content-type': 'multipart/form-data;',
          },
          formData: { merchant_uid: orderUID },
        };
      } else {
        options = {
          method: 'POST',
          url: 'https://api.iamport.kr/payments/cancel',
          headers: {
            'x-imptokenheader': token,
            'content-type': 'multipart/form-data;',
          },
          formData: { merchant_uid: orderUID, amount: cancel_amount },
        };
      }

      request(options, (error, response, body) => {
        if (error) throw new Error(error);
        const result = JSON.parse(body);
        if (result.code === 0) {
          resolve(true);
        } else {
          reject('취소 실패');
        }
      });
    });
  });
}

