const express = require('express');
const router = express.Router();
const sessions = require('../services/accel-cmd-tcp');

router.get( '/' , ( req , res , next ) => {
    var objeto= new Promise(
        async function(resolve,reject){
        await resolve(sessions.getSessions(res));
    });
    
});

module.exports=router;