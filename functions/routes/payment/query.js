const {decrypt, encrypt} = require('../../util/encryption')

exports.INSERT_NEW_CARD_INFO = `
  insert into TB_PAYMENT_METHOD (USER_UID, PAYMENT_METHOD_KEY, PAYMENT_METHOD_INFO) values
  (?,${encrypt()},${encrypt()});
`;

exports.GET_USER_CARD_INFO = `
  select PAYMENT_METHOD_UID, ${decrypt('PAYMENT_METHOD_INFO')}, CREATED_AT from TB_PAYMENT_METHOD where USER_UID = ? and DELETED=0;
`;

exports.GET_USER_CARD_KEY = `
  select ${decrypt('PAYMENT_METHOD_KEY')} from TB_PAYMENT_METHOD where USER_UID = ? and DELETED=0;
`;

exports.DELETE_USER_CARD = `
  update TB_PAYMENT_METHOD set DELETED = 1 where USER_UID = ?;
`;
