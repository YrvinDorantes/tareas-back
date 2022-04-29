"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const autenticacion_1 = require("../middlewares/autenticacion");
const task_model_1 = require("../models/task.model");
const taskRoutes = (0, express_1.Router)();
//Obtener Tareas con paginacion
taskRoutes.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina - 1;
    skip = skip * 10;
    const tasks = yield task_model_1.Task.find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(10)
        .populate([{ path: 'usuario', select: ['nombre', 'email'] },])
        .exec();
    res.json({
        ok: true,
        pagina,
        tasks
    });
}));
//Obtener una tarea en especifico
taskRoutes.get('/:taskid', [autenticacion_1.verificaToken], (req, res) => {
    const taskId = req.params.taskid;
    task_model_1.Task.find({ _id: taskId }, function (err, taskDB) {
        if (err) {
            res.send(err);
        }
        res.json({
            ok: true,
            task: taskDB
        });
    });
});
//Crear tarea asignado a un usuario
taskRoutes.post('/', [autenticacion_1.verificaToken], (req, res) => {
    const body = req.body;
    body.usuario = req.usuario._id;
    task_model_1.Task.create(body).then((taskDB) => __awaiter(void 0, void 0, void 0, function* () {
        yield taskDB.populate([{ path: 'usuario', select: ['nombre', 'email'] },]);
        res.json({
            ok: true,
            task: taskDB
        });
    })).catch(err => {
        res.json(err);
    });
});
//Actualizar tarea asignada a un usuario
taskRoutes.put('/:taskid', [autenticacion_1.verificaToken], (req, res) => {
    const body = req.body;
    //body.usuario = req.usuario._id;
    const taskId = req.params.taskid;
    console.log(body);
    console.log(taskId);
    task_model_1.Task.updateOne({ _id: taskId }, body, function (err, taskDB) {
        if (err) {
            res.json(err);
        }
        else {
            res.json({
                ok: true,
                task: taskDB
            });
        }
    });
});
exports.default = taskRoutes;
