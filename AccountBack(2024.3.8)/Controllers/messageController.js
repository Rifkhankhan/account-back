const MessageModel = require("../Models/MessageModel");
const mongoose = require('mongoose');

//add new doc
exports.addMessage = async (req, res) => {
  const {chatId,senderId, text} = req.body;

  const message = new MessageModel({
    chatId,
    senderId,
    text
    });

  try {
    const result = await message.save();
    res.status(200).json(result);
  } catch(error) {
    res.status(500).json({message:"Fail to send request",error:error.message})
  }
  
  }
  
  //Get
  exports.getMessages = async (req, res) => {
    const {chatId} = req.params;

    try{
        const result = await MessageModel.find({chatId});
        res.status(200).json(result);
    } catch (error) {
        res.status.json(error);
    }

  }

  