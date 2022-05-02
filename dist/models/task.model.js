"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Task = void 0;
const mongoose_1 = require("mongoose");
const taskSchema = new mongoose_1.Schema({
    titulo: {
        type: String,
        required: [true, 'El título de la tarea es requerido']
    },
    subtitulo: {
        type: String,
        required: [true, 'El subtítulo de la tarea es requerido']
    },
    prioridad: {
        type: String,
        requiered: [false]
    },
    categoria: {
        type: String,
        requiered: [false]
    },
    estatus: {
        type: String,
        required: [true, 'El estatus de la tarea es requerido']
    },
    created: {
        type: Date
    },
    updateAt: {
        type: Date
    },
    dateTask: {
        type: Date
    },
    usuario: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'Debe existir la relación entre usuario y la tarea']
    }
});
taskSchema.pre('save', function (next) {
    this.created = new Date();
    this.updatedAt = new Date();
    next();
});
exports.Task = (0, mongoose_1.model)('Task', taskSchema);
