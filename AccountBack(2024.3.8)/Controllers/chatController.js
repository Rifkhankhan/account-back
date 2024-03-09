const ChatModel = require("../Models/ChatModel");
const mongoose = require('mongoose');

//add new doc
exports.createChat = async (req, res) => {

  let chat = [];

  try {
  chat = await ChatModel.find({
    members: {$all: [req.body.senderId, req.body.receiverId]}
  });

  if (!chat || chat.length === 0) {
    const newChat = new ChatModel({
      members: [req.body.senderId, req.body.receiverId]
    });

    await newChat.save();
    res.status(200).json(newChat);

  } else {
			return res.status(409).json({ message: 'Already have chat!' });
  }

  // let members;
  // const chats = await ChatModel.find();
  // for (let chat of chats) {
  //   members = chat.members;
	// }
  // console.log(members)
  //   if(members.includes(req.body.senderId) && members.includes(req.body.receiverId)){
  //     res.status(500).json({message:"",error:error.message})
  //   } else{
  //     const newChat = new ChatModel({
  //       members: [req.body.senderId, req.body.receiverId]
  //       });
  //   }
  } catch(error) {
    res.status(500).json({message:"Fail to send request",error:error.message})
  }
  
  }
  
  //Get BY USER
  exports.userChats = async (req, res) => {

    try{
      const chat = await ChatModel.find({
        members: {$in: [req.params.userId]}
      });
      res.status(200).json(chat);
    } catch (error) {
      res.status.json(error);
    }

  }
  
   
// find chat
  exports.findChat = async(req,res) => {
    
    try{
        const chat = await ChatModel.findOne({
            members: {$all: [req.params.firstId, req.params.secondId]}
          });
        res.status(200).json(chat);
    } catch(error){
        res.status(500).json({message:"Error with updating details",error:error.message});
    }

}

  