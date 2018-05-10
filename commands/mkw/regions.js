module.exports = message => {
    let embed = new message.Discord.RichEmbed()
        .setTitle('Mario Kart Wii top regions')
        .setDescription('Currently there are ' + Object.values(message.wiimmfi_api.text.regions).reduce((a,b)=>a+b) + ' players in 4 different login regions');
    Object.entries(message.wiimmfi_api.text.regions).sort((a,b)=>b[1]-a[1]).map(e => {
        if(e[0] === 'ctgp') embed.addField('CTGP', `${e[1]} players`);
        else if(e[0] === 'ame') embed.addField('America', `${e[1]} players`);
        else if(e[0] === 'jap') embed.addField('Japan', `${e[1]} players`);
        else if(e[0] === 'eur') embed.addField('Europe', `${e[1]} players`);
    });
    embed.setColor(message.embedColors[Math.floor(Math.random() * message.embedColors.length)])
        .setFooter('Data will be refreshed every 5 minutes')
        .setTimestamp(new Date(message.wiimmfi_api.lastCheck));
    message.channel.send(embed);
};
