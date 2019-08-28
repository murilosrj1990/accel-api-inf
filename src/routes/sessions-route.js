const express = require('express');
const router = express.Router();
const sessions = require('../services/accel-cmd-tcp');

router.get( '/' , ( req , res , next ) => {
    var orderBy;
    var columns;
    if(typeof req.query.orderBy==='undefined'){
        orderBy="";
    }else{
        orderBy=req.query.orderBy;;
    }

    if(typeof req.query.columns==='undefined'){
        columns="";
    }else{
        columns=req.query.columns;
    }
    
    var objeto= new Promise(
        async function(resolve,reject){
        await resolve(sessions.getSessions(res,orderBy,columns));
    });
    
});

router.delete('/', (req,res,next) =>{
    new Promise(
        async function(resolve,reject){
            await resolve(sessions.terminateSessionsByParameter(req.body.terminate_type,req.body.terminate_parameter,req.body.terminate_mode));
            res.status(200).send({
                message: "Terminate session command was sent to accel server!",
                command_parameter: [req.body] 
            })
        }
    );
});

module.exports=router;