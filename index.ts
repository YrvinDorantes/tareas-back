import Server from "./clases/server";
import userRoutes from './routes/usuario';
import mongoose from 'mongoose';
import bodyParsr from 'body-parser';


const server = new Server();


//Body Parser
server.app.use( bodyParsr.urlencoded({
    extended: true
}) );
server.app.use( bodyParsr.json() );

//Rutas de la aplicación
server.app.use('/user', userRoutes);

//Conexión a la base de datos de MongoDB
mongoose.connect('mongodb://localhost:27017/tareas', ( err ) => {

   if ( err ) throw err;

   console.log('Base de datos ONLINE');
})

//Iniciar el servidor express
server.start( () => {
    console.log(`Servidor corriendo en puerto ${ server.port }`);
});