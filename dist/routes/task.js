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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mongoose_1 = __importDefault(require("mongoose"));
const autenticacion_1 = require("../middlewares/autenticacion");
const task_model_1 = require("../models/task.model");
const taskRoutes = (0, express_1.Router)();
//Obtener Tareas con paginación asociadas a un usuario
taskRoutes.get('/', [autenticacion_1.verificaToken], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ObjectId = mongoose_1.default.Types.ObjectId;
    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina - 1;
    skip = skip * 10;
    const tasks = yield task_model_1.Task.aggregate([
        {
            $lookup: {
                from: "usuarios",
                localField: "usuario",
                foreignField: "_id",
                as: "tareasUsuario"
            }
        },
        {
            $unwind: "$tareasUsuario"
        },
        { $match: { $expr: { $eq: ['$usuario', { $toObjectId: req.usuario._id }] }, estatus: { $ne: 'Cancelado' } } }
    ])
        .sort({ _id: -1 })
        .skip(skip)
        .limit(10)
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
    const taskId = req.params.taskid;
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
