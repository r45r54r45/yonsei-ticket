const {decrypt} = require('../../util/encryption')
exports.GET_ALL_NOTICES = `
  SELECT notice.*, ${decrypt('USER_NAME')} from TB_NOTICE notice
  join TB_USER user on notice.USER_UID = user.USER_UID;

`;
