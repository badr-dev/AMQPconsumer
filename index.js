const mysql = require('mysql');
const bunnymq = require('bunnymq')({
    host: 'amqp://nzgmkclf:XjPG1TRprZiDChCgreL36AFqA6MxaUMH@lark.rmq.cloudamqp.com/nzgmkclf',
    prefetch: 5,
    requeue: true
}).consumer;

//const pool = mysql.createPool("mysql://root:,>pJRen5)W33HZ,x^w!MDv)_Xy*cypJa>APL*Cg3}'@localhost/speedbouffe");


var pool  = mysql.createPool({
    host     : 'localhost',
    user     : "root",
    password : ",>pJRen5)W33HZ,x^w!MDv)_Xy*cypJa>APL*Cg3}'",
    database : 'speedbouffe',
    connectionLimit : 42
});



function runQuery(query) {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, conn) => {
	if (err) {
	    console.log("ERROR CONNECTION : " + err);
	    return reject(err);
	}
	conn.query(query, (err, res) => {
	conn.release();
        if (err) return reject(err);
        return resolve(res);
      });
    });
  });
}

bunnymq.consume('sql:query:run', (msg) => {
  if (msg && typeof msg === 'string') {
    return runQuery(msg)
    .then((res) => {
      //console.log(res);
      return res;
    })
    .catch((err) => {
      console.error(err);
      return false;
    });
  } else {
    console.log("type msg undefined");
    return Promise.resolve(false);
  }
});

