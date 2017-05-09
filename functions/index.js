var functions = require('firebase-functions');
const {INSERT_USER, VERIFY_USER} = require('./routes/user/query');
const query = require('./util/mysql');
const request = require('request');
const cors = require('cors')({
  origin: ['http://localhost:5000','https://projectg2016.firebaseapp.com'],
  optionsSuccessStatus: 200
});
const {getUserUid, getAdmin} = require('./util/encryption')


exports.notice = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    const notice = require('./routes/notice');
    switch (req.method) {
      case 'POST':
        getUserUid(req)
          .then(uid => {
            req.UID = uid;
            notice.method.POST(req, res);
          });
        break;
      case 'GET':
        notice.method.GET(req, res);
        break;
      default:
        res.json({
          error: "not supported method"
        })
    }
  });
});
exports.payment = functions.https.onRequest((req, res)=>{
  cors(req, res, () => {
    const payment = require('./routes/payment');
    switch (req.method) {
      case 'POST':
        getUserUid(req)
          .then(uid => {
            req.USER_UID = uid;
            payment.method.POST(req, res);
          });
        break;
      case 'GET':
        getUserUid(req)
          .then(uid => {
            req.USER_UID = uid;
            payment.method.GET(req, res);
          });
        break;
      case 'DELETE':
        getUserUid(req)
          .then(uid => {
            req.USER_UID = uid;
            payment.method.DELETE(req, res);
          });
        break;
      default:
        res.json({
          error: "not supported method"
        })

    }
  });
});
exports.reservation = functions.https.onRequest((req, res)=>{
  cors(req, res, () => {
    const reservation = require('./routes/reservation');
    switch (req.method) {
      case 'POST':
        // start reservation
        getUserUid(req)
          .then(uid => {
            req.USER_UID = uid;
            reservation.method.POST(req, res);
          });
        break;
      case 'GET':
        // get reservation history
        getUserUid(req)
          .then(uid => {
            req.USER_UID = uid;
            reservation.method.GET(req, res);
          });
        break;
      default:
        res.json({
          error: "not supported method"
        })

    }
  });
})
exports.user = functions.https.onRequest((req, res)=>{
  cors(req, res, () => {
    const user = require('./routes/user');
    switch (req.method) {
      case 'POST':
        // TODO
        // getUserUid(req)
        //   .then(uid => {
        //     req.USER_UID = uid;
        //     user.method.POST(req, res);
        //   });
        break;
      case 'GET':
        // get user data
        getUserUid(req)
          .then(uid => {
            req.USER_UID = uid;
            user.method.GET(req, res);
          });
        break;
      default:
        res.json({
          error: "not supported method"
        })

    }
  });
})
exports.login = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    switch (req.method) {
      case 'POST':
        const {SCHOOL_ID, LOGIN_PASSWORD} = req.body;
        console.log(SCHOOL_ID, LOGIN_PASSWORD)
        query(VERIFY_USER, [SCHOOL_ID, LOGIN_PASSWORD])
          .then((result) => {
            if (result.length === 0) {
              // no user in db
              // fetch from yonsei-portal
              const user = require('./routes/user');
              return user.checkAccount(SCHOOL_ID, LOGIN_PASSWORD)
                .then(data => {
                  if (data.code === -1) {
                    return res.json({
                      code: -1,
                      err_msg: "포탈 인증 실패"
                    });
                  }
                  const USER_NAME = '';
                  // insert user in db
                  let USER_UID = null;
                  query(INSERT_USER, [SCHOOL_ID, USER_NAME, LOGIN_PASSWORD])
                    .then((result) => {
                      USER_UID = result.inserted.insertId;
                      return getAdmin().auth().createCustomToken(USER_UID, {
                        name: USER_NAME
                      })
                    })
                    .then((customToken) => {
                      res.json({
                        token: customToken
                      });
                    })
                    .catch((error) => {
                      console.log("Error creating custom token:", error);
                    });
                })

              // request({
              //   method: 'POST',
              //   url: 'https://yonsei-api.appspot.com/',
              //   headers: {
              //     'content-type': 'application/json'
              //   },
              //   body: {id: SCHOOL_ID, pw: LOGIN_PASSWORD},
              //   json: true
              // }, function (error, response, body) {
              //   if (error) throw new Error(error);
              //   const data = body;
              //   if (data.code === -1) {
              //     return res.json({
              //       code: -1,
              //       err_msg: "포탈 인증 실패"
              //     });
              //   }
            } else {
              // login success
              // session management
              const isAdmin = result[0].ADMIN;
              let USER_UID = result[0].USER_UID.toString();
              getAdmin().auth().createCustomToken(USER_UID, {
                name: '김우현',
                isAdmin
              })
                .then((customToken) => {
                  res.json({
                    token: customToken
                  });
                })
                .catch((error) => {
                  console.log("Error creating custom token:", error);
                });
            }
          })
        break;
      default:
        res.json({
          error: "not supported method"
        })
    }
  });
})
