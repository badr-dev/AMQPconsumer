const mysql = require('mysql');
const bunnymq = require('bunnymq')({
  host: 'amqp://nzgmkclf:XjPG1TRprZiDChCgreL36AFqA6MxaUMH@lark.rmq.cloudamqp.com/nzgmkclf'
}).consumer;

const pool = mysql.createPool('mysql://ykhatal:BFnRnnxnugEvXVY95jdw6Knf@localhost/speedboufe');

function runQuery(query) {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, conn) => {
      if (err) return reject(err);
      conn.query(query, (err, res) => {
        if (err) return reject(err);
        return resolve(res);
      });
    });
  });
}

bunnymq.consume('sql:query:run', (msg) => {
  console.log(msg);
  if (msg && typeof msg === 'string') {
    return runQuery(msg)
    .then((res) => {
      console.log(res);
      return res;
    })
    .catch((err) => {
      console.error(err);
      return false;
    });
  } else {
    return Promise.resolve(false);
  }
});

process.stdin.resume();
