var mysql      = require('mysql');
var conn = mysql.createConnection({
  host     : 'localhost',
  user     : 'nodejs',
  password : '111111',
  database : 'o2'
});

conn.connect();


// conn.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
//     if (error) throw error;
//     console.log('The solution is: ', results[0].solution);
//   });
  
var sql = 'SELECT * FROM topic';
conn.query(sql, (err, rows, fields) => {
    if(err){
        console.log(err);
    } else {
        console.log('rows', rows);
        console.log('fields', fields);
    }
});
conn.end();