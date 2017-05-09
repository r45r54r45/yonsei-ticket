const {decrypt, encrypt} = require('../../util/encryption')

const ATTEMPT_BUS_RESERVATION = `
CALL PRC_RESERVE_BUS(?, ?, ?, ?, ?, ?, @result);
`
const GET_CURRENT_RESERVATION_COUNT = `
  select count(*) as count, TIME_STRING from TB_BUS_RESERVATION_HISTORY where DATE_STRING = ? GROUP BY TIME_STRING;
`;
const GET_USER_RESERVATION_STATUS = `
  select count(*) as count, TIME_STRING from TB_BUS_RESERVATION_HISTORY where DATE_STRING = ? and USER_UID = ? GROUP BY TIME_STRING;

`;
module.exports = {
  ATTEMPT_BUS_RESERVATION,
  GET_CURRENT_RESERVATION_COUNT,
  GET_USER_RESERVATION_STATUS
}
