import { Router, Response } from 'express';
import { verificaToken } from '../middlewares/autenticacion';
import { Task } from '../models/task.model';


const taskRoutes  = Router();



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



export default taskRoutes; 