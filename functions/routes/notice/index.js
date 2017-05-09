const query = require('../../util/mysql');
const {GET_ALL_NOTICES} = require('./query');
exports.method = {
  POST: (req, res) => {

  },
  GET: (req, res) => {
    query(GET_ALL_NOTICES)
      .then(rows => {
        res.json(rows);
      })
  }
}
