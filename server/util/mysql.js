const mysql = require('mysql');
const pool  = mysql.createPool({
  host     : '104.199.223.232',
  user     : 'root',
  password : 'e34e43e34',
  database : 'YONSEI'
});
const query = (query, data) => {
  return new Promise((resolve, reject)=>{
    pool.getConnection(function(err, connection) {
      connection.query(query, data, function (error, results, fields) {
        connection.release();
        if (error) throw error;
        resolve(results);
      });
    });
  })
}


module.exports = query;
