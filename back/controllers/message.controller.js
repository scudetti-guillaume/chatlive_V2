const { log } = require("console");
const MessageModel = require("../models/message.model");
const path = require("path");

exports.registerMessage = async (data, filename, res) => {
  try {
    // console.log(data);
    console.log(filename);
    const { text, pseudo, userId, date, pictureUser, pictureName } = data;
    if (pseudo === null || userId === null) return res({ success: false, error: "erreur veuillez réessayer" });
    // const uniqueFileName = `${Date.now()}_${pictureName}`;
    const messageNew = new MessageModel({
      text: text,
      pseudo: pseudo,
      userId: userId,
      date: date,
      pictureUser: pictureUser,
      pictureMessage: data.pictureName != '' || null ? `${process.env.BASE_IMAGE_MESSAGE}/${filename}`
        : ``,
    });


    await messageNew.save()
    console.log(messageNew)
    res({ success: true, message: messageNew });
  } catch (err) {
    console.log(err);
    return res({ success: false, error: "erreur veuillez réessayer" });
  }
}

exports.getAllMessages = async (data, res) => {
  try {
    const messagesArray = []
    const messages = await MessageModel.find();
    messages.forEach(message => {
      messagesArray.push(message);
    })
    res({ success: true, messagesArray });
  } catch (err) {
    console.log(err);
    return res({ success: false, error: "erreur veuillez réessayer" });
  }
}

exports.deleteMessage = async (data, res) => {
  console.log(data);
  try {
    const messages = await MessageModel.deleteOne({ _id: data });
    console.log(messages);
    if (messages.deletedCount == 0)  {
    res({ success: false, error: "erreur veuillez réessayer" })
    console.log("erreur veuillez réessayer");
    }else{
      res({ success: true });
    }
  } catch (err) {
    console.log(err);
    return res({ success: false, error: "erreur veuillez réessayer" });

  }
}