const UserModel = require('../models/user.model');
const ObjectID = require('mongoose').Types.ObjectId;


module.exports.getAllUsers = async (req, res) =>{
    const users = await UserModel.find().select('-password');
    res.status(200).json(users);
}

module.exports.userInfo = (req, res) =>{
    console.log(req.params);
    if(!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID unknown :' +req.params.id)

    UserModel.findById(req.params.id , (err,docs) =>{
        if(!err) res.send(docs);
        else console.log('ID unknown :' +err);
    }).select('-password');

};

module.exports.updateUser = async (req, res) =>{
    if(!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID unknown :' +req.params.id)

    try{
        await UserModel.findByIdAndUpdate(
            { _id : req.params.id},
            {
                $set:{
                    bio:req.body.bio
                }
            },
            { new :true, upsert:true , setDefaultsOnInsert : true},
            (err , docs) =>{
                if(!err) return res.send(docs);
                if(err) return res.status(500).send ({message :err});
            }
        )
    }catch(err){
        return res.status(500).json({ message : err});
    }
};


module.exports.deleteUser = async (req ,res) =>{
    if(!ObjectID.isValid(req.params.id))
    return res.status(400).send('ID unknown :' +req.params.id)
try{
    await UserModel.remove({ _id:req.params.id}).exec();
    res.status(200).json({ message :"Sucessfully deleted"});

}catch(err){
    return res.status(500).json({message: err});
}
}

module.exports.follow = async (req,res) =>{
    if(!ObjectID.isValid(req.params.id )|| !ObjectID.isValid(req.body.idToFollow))
    return res.status(400).send('ID unknown :' +req.params.id)
try{
    await UserModel.findByIdAndUpdate(
        req.params.id,
        {$addToSet :{ following: req.body.idToFollow}},
        {new:true, upsert:true},
        (err, docs )=>{
            if(!err) res.status(201).json(docs);
            else return res.status(400).json(err);
        }
    );
    //add too folowinfg list
    await UserModel.findByIdAndUpdate(
        req.body.idToFollow,
        {$addToSet :{ folloqers: req.params.id}},
        {new:true, upsert:true},
        (err, docs )=>{
            //if(!err) res.status(201).json(docs);
            if (err) return res.status(400).json(err);
        }
    )
}catch(err){
    return res.status(500).json({message: err});

}
}
//req.params : paramatre dans la zone de recherche de lien
//req.body : dans la body :k--