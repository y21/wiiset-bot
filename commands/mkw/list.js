module.exports = message => {
    message.channel.send(new message.Discord.RichEmbed()
        .setTitle('Mario Kart Wii rooms list')
        .setDescription(`There are ${Object.values(message.wiimmfi_api.text.available).reduce((a, b) => parseInt(b)+parseInt(a))-message.wiimmfi_api.text.available.players} rooms available.`)
        .setColor(message.embedColors[Math.floor(Math.random() * message.embedColors.length)])
        .setThumbnail('http://chadsoft.co.uk/wiimmfi/wiimmfi-dark.png')
        .addField('Worldwide rooms', message.wiimmfi_api.text.available.worldwides)
        .addField('Continental rooms', message.wiimmfi_api.text.available.continentals)
        .addField('Private rooms', message.wiimmfi_api.text.available.privates)
        .addField('Players', message.wiimmfi_api.text.available.players)
        .setFooter('Data will be refreshed every 5 minutes')
        .setTimestamp(new Date(message.wiimmfi_api.lastCheck))
    );
};
