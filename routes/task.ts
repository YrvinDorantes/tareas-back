import { Router, Response } from 'express';
import { verificaToken } from '../middlewares/autenticacion';
import { Task } from '../models/task.model';


const taskRoutes  = Router();


//Obtener Tareas con paginacion
taskRoutes.get('/', [verificaToken], async (req: any, res: Response) =>{

    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina -1;
    skip = skip * 10;

    const tasks = await Task.find()
                    .where({ estatus: { $ne: 'Cancelado' } })
                    .sort({_id: -1 })
                    .skip(skip)
                    .limit(10)
                    .populate('usuario')
                    .exec(
                        
                    );

    res.json({
        ok: true,
        pagina,
        tasks
    });
});


//Obtener una tarea en especifico
taskRoutes.get('/:taskid', [verificaToken], (req: any, res: Response) => {

    const taskId    = req.params.taskid;

    Task.find({_id: taskId  }, function(err : any, taskDB: any) 
        {
            if (err)
            {
                res.send(err);
            }
            res.json({
                ok: true,
                task: taskDB
            });
        });

});


//Crear tarea asignado a un usuario
taskRoutes.post('/', [verificaToken], (req: any, res: Response) => {

    const body = req.body;
    body.usuario = req.usuario._id;

    Task.create( body).then( async (taskDB:any)  => {

    
        await taskDB.populate([{path: 'usuario', select: [ 'nombre','email']}, ]);
        
        res.json({
            ok: true,
            task: taskDB
        });
    }).catch(err => {
    res.json(err);
    });

});


//Actualizar tarea asignada a un usuario
taskRoutes.put('/:taskid', [verificaToken],  (req: any, res: Response) => {

    const body = req.body;
    const taskId    = req.params.taskid;

    console.log(body);
    console.log(taskId);

    Task.updateOne({ _id: taskId }, 
        body, function (err: any, taskDB: any) {
        if (err){
            res.json(err);
        }
        else{
            res.json({
                ok: true,
                task: taskDB
            });
        }
    });

});


export default taskRoutes; 