const express = require('express');
const router = express.Router();
const sessions = require('../services/accel-cmd-tcp');

router.get( '/:orderBy' , ( req , res , next ) => {
    const orderBy=req.params.orderBy;
    var objeto= new Promise(
        async function(resolve,reject){
        await resolve(sessions.getSessions(res,orderBy));
    });
    
});

router.get( '/' , ( req , res , next ) => {
    const orderBy="sid";
    var objeto= new Promise(
        async function(resolve,reject){
        await resolve(sessions.getSessions(res,orderBy));
    });
    
});

router.delete('/', (req,res,next) =>{
    console.log(req.body.terminate_type);
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