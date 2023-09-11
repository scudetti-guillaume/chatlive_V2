const MessageModel = require("../models/message.model");


exports.registerMessage = async (data, res) => {
  try {
    console.log(data);
    const { text, pseudo, userId, date, pictureUser, pictureName } = data;
    if (pseudo === null || userId === null) return res({ success: false, error: "erreur veuillez réessayer" });
    const uniqueFileName = `${Date.now()}_${pictureName}`;
    const messageNew = new MessageModel({
      text: text,
      pseudo: pseudo,
      userId: userId,
      date: date,
      pictureUser: pictureUser,
      pictureMessage: pictureName != null ? `${process.env.BASE_IMAGE_MESSAGE}/${uniqueFileName}`
        : ``,
    });


    await messageNew.save()
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