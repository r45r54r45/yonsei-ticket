const {decrypt, encrypt} = require('../../util/encryption')

const INSERT_USER = `
  insert into TB_USER (SCHOOL_ID, USER_NAME, LOGIN_PASSWORD) values (${encrypt()},${encrypt()},${encrypt()})
`
const VERIFY_USER = `
  select * from TB_USER where SCHOOL_ID = ${encrypt()} and LOGIN_PASSWORD = ${encrypt()}
`;

const GET_USER_BUS_HISTORY = `
  select DATE_STRING, TIME_STRING, FROM_LOCATION from TB_BUS_RESERVATION_HISTORY where USER_UID = ?; 
`;
module.exports = {
  INSERT_USER,
  VERIFY_USER,


  GET_USER_BUS_HISTORY,

}
