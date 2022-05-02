

import { Schema, Document, model} from 'mongoose';

const taskSchema = new Schema({

    titulo:{
        type: String,
        required: [true, 'El título de la tarea es requerido']
    },
    subtitulo:{
        type: String,
        required: [true, 'El subtítulo de la tarea es requerido']
    },
    prioridad:{
        type: String,
        requiered:[false]
    },
    categoria:{
        type: String,
        requiered:[false]
    },
    estatus:{
        type:String,
        required: [true, 'El estatus de la tarea es requerido']
    },
    created:{
        type: Date
    },
    updateAt:{
        type: Date
    },
    dateTask:{
        type: Date
    },
    usuario:{
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'Debe existir la relación entre usuario y la tarea']
    }
});

taskSchema.pre<ITask>('save', function( next) {
    this.created = new Date();
    this.updatedAt = new Date();
    next();
});

interface ITask extends Document {
    titulo: String,
    subtitulo: String,
    prioridad: String,
    categoria: String,
    estatus: String,
    created: Date,
    updatedAt: Date,
    dateTask: Date,
    usuario: String
}

export const Task = model<ITask>('Task', taskSchema);

