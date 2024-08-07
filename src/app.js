const express = require('express');
const app = express();
const newConnection = require("../database")
app.use(express.json());


// Devuelve todas las tareas
app.get('/task', async (req, res) => {
   const connection = await newConnection()
   const result = await connection.query("SELECT * FROM tasks")
   res.json(result[0])
   connection.end()
});

// devilve las tareas por id
app.get('/task/:id', async (req, res) => {
   const connection = await newConnection();
   const { id } = req.params;
 
   try {
     const [rows] = await connection.query("SELECT * FROM tasks WHERE id = ?", [id]);
     
     if (rows.length === 0) {
       res.status(404).json({ message: "Tarea no encontrada" });
     } else {
       res.json(rows[0]);
     }
   } catch (error) {
     res.status(500).json({ message: "Error al obtener la tarea", error: error.message });
   } finally {
     connection.end();
   }
 });
 



// Agregar tareas 
app.post('/task', async (req, res) => {
   const connection = await newConnection();
   const { title, description, isComplete } = req.body;
   const [result] = await connection.query("INSERT INTO tasks (title, description, isComplete) VALUES (?, ?, ?)", [title, description, isComplete]);
 
   if (result.affectedRows === 0) {
     res.status(500).json({ message: "No es posible añadir la taréa" });
   } else {
     res.status(201).json({ message: "La tarea se agrego correctamente", id: result.insertId, title, description, isComplete });
   }
 
   connection.end();
 });
 

// Eliminar una tarea
app.delete('/task/:id', async (req, res) => {
   const connection = await newConnection();
   const { id } = req.params;
 
   try {
     const [result] = await connection.query("DELETE FROM tasks WHERE id = ?", [id]);
 
     if (result.affectedRows === 0) {
       res.status(404).json({ message: "No se encontró la tarea con el ID proporcionado" });
     } else {
       res.status(200).json({ message: "La tarea se eliminó correctamente", id });
     }
   } catch (error) {
     res.status(500).json({ message: "Error al eliminar la tarea", error: error.message });
   } finally {
     connection.end();
   }
 });
// Actualizar tarea
app.put('/task/:id', async (req, res) => {
   const connection = await newConnection();
   const { id } = req.params;
   const { title, description, isComplete } = req.body;
 
   try {
     const [result] = await connection.query(
       "UPDATE tasks SET title = ?, description = ?, isComplete = ? WHERE id = ?",
       [title, description, isComplete, id]
     );
 
     if (result.affectedRows === 0) {
       res.status(404).json({ message: "Tarea no encontrada o no actualizada" });
     } else {
       res.status(200).json({ message: "La tarea se actualizó correctamente", id, title, description, isComplete });
     }
   } catch (error) {
     res.status(500).json({ message: "Error al actualizar la tarea", error: error.message });
   } finally {
     connection.end();
   }
 });

app.listen(3000, () => console.log('servidor corriendo en el puerto 3000'))
