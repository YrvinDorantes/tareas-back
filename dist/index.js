"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./clases/server"));
const usuario_1 = __importDefault(require("./routes/usuario"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const task_1 = __importDefault(require("./routes/task"));
const server = new server_1.default();
//Body Parser
server.app.use(body_parser_1.default.urlencoded({
    extended: true
}));
server.app.use(body_parser_1.default.json());
//Rutas de la aplicación
server.app.use('/user', usuario_1.default);
server.app.use('/tasks', task_1.default);
//Conexión a la base de datos de MongoDB
mongoose_1.default.connect('mongodb://localhost:27017/tareas', (err) => {
    if (err)
        throw err;
    console.log('Base de datos ONLINE');
});
//Iniciar el servidor express
server.start(() => {
    console.log(`Servidor corriendo en puerto ${server.port}`);
});
