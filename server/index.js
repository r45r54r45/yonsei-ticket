const express = require('express');
const session = require('express-session');
const redis = require('connect-redis');
const RedisStore = redis(session);
const path = require('path');

const app = express();

app.use(session({
  store: new RedisStore({
    host: 'pub-redis-13660.us-central1-1-1.gce.garantiadata.com',
    port: '13660',
    pass: 'e34e43e34'
  }),
  secret: 'keyboard cat'
}));
app.use(express.static('dist'));

app.use('/api/user', require('./routes/user'));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../prod_index.html'));
});

app.listen(process.env.PORT || 5001);
