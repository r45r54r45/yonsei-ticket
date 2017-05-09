const encryptKey = 'yonsei-woohyun';
const admin = require("firebase-admin");
const serviceAccount = require("../credential/firebase-projectg2016-firebase-adminsdk-b3t7t-081318694c.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://projectg2016.firebaseio.com"
});

function encrypt() {
  return `HEX(AES_ENCRYPT(?,MD5('${encryptKey}')))`;
}
function decrypt(column) {
  return `CAST(AES_DECRYPT(UNHEX(${column}),MD5('${encryptKey}')) as CHAR) as ${column}`;
}
function getUserUid(req){
  return new Promise((resolve, reject)=>{
    if(req.body.token){
      admin.auth().verifyIdToken(req.body.token)
        .then((decodedToken) => {
          const uid = decodedToken.uid;
          resolve(uid)
        })
        .catch((error) => {
          reject(error)
        });
    }else if(req.headers.token){
      admin.auth().verifyIdToken(req.headers.token)
        .then((decodedToken) => {
          const uid = decodedToken.uid;
          resolve(uid)
        })
        .catch((error) => {
          reject(error)
        });
    }else{
      reject('unauthorized');
    }
  })
}
function getAdmin(){
  return admin;
}
module.exports = {
  encrypt,
  decrypt,
  getUserUid,
  getAdmin
}
