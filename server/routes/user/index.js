const express = require('express');
const Router = express.Router();
const path = require('path');
const query = require('../../util/mysql');

Router.get('/login', (req, res) => {
  query('insert into TB_USER (SCHOOL_ID, USER_NAME, LOGIN_PASSWORD) values (?,?,?)', ['2014198024', '김우현', '3333'])
    .then((result)=>{
      res.json(result);
    })
});

module.exports=Router;
