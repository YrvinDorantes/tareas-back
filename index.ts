import Server from "./clases/server";
import userRoutes from './routes/usuario';
import mongoose from 'mongoose';

import cors from 'cors';

import bodyParsr from 'body-parser';
import taskRoutes from "./routes/task";
import "dotenv/config";


const server = new Server();



//Body Parser
server.app.use( bodyParsr.urlencoded({
    extended: true
}) );
server.app.use( bodyParsr.json() );


//Configuración del CORS
server.app.use( cors({ origin: true, credentials: true}));

//Rutas de la aplicación
server.app.use('/user', userRoutes);
server.app.use('/tasks', taskRoutes);


//Conexión a la base de datos de MongoDB
mongoose.connect( `${process.env.MONGODB_URI}` , ( err ) => {

   if ( err ) throw err;

   console.log('Base de datos ONLINE');
})

//Iniciar el servidor express
server.start( () => {
    console.log(`Servidor corriendo en puerto ${ server.port }`);
});