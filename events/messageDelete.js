module.exports = data => {
    const { messagelogs, message } = data;
    if (messagelogs.find(v => v.mid === message.id)) message.channel.messages.get(messagelogs.find(v => v.mid === message.id).rid).delete();
    messagelogs.splice(messagelogs.findIndex(v => v.mid === message.id));
};