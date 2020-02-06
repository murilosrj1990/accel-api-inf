const config = require('../config.json');

module.exports = (req , res, next)=>{
    const {user , password} = req.body;

    if(!user || !password) 
        return res.status(401).send({error: "User or password is missing!"});

    if(user!=config.user || password!=config.password)
        return res.status(401).send({error: "User or password invalid!"});

    return next();
};



    

