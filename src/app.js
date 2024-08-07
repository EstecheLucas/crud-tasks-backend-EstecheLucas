const express = require('express');
const app = express();
const newConnection = require("../database")
app.use(express.json());


// Devuelve todas las tareas
app.get('/task', async (req, res) => {
   const connection = await newConnection()
   const result = await connection.query("SELECT * FROM tasks")
   res.json(result[0])
   connection.end
});


app.listen(3000, () => console.log('servidor corriendo en el puerto 3000'));