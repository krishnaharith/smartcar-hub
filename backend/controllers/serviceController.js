import Service from "../models/service.js";

export const getServices = async (req,res)=>{
  try{
    const services = await Service.find();
    res.json(services);
  }
  catch(err){
    res.status(500).json({error:err.message});
  }
};

export const addService = async (req,res)=>{
  try{
    const service = new Service(req.body);
    await service.save();
    res.json({message:"Service added"});
  }
  catch(err){
    res.status(500).json({error:err.message});
  }
};