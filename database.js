const taskdb = require(mysql2)


async function connectiondataabase(params) {
    

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'tasks'
}) 
return connection
};

module.exports = {connectiondataabase}
