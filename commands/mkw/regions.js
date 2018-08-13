module.exports = message => {
    let embed = new message.Discord.RichEmbed()
        .setTitle(message.translations.commands.mkw_top_regions || "Translation error")
        .setDescription((message.translations.commands.mkw_region_players || "Translation error").replace(/{players}/g, Object.values(message.wiimmfi_api.text.regions).reduce((a,b)=>a+b)));
    Object.entries(message.wiimmfi_api.text.regions).sort((a,b)=>b[1]-a[1]).map(e => {
        if(e[0] === 'ctgp') embed.addField('CTGP', `${e[1]} ${message.translations.commands.mkw_players || "Translation error"}`);
        else if(e[0] === 'ame') embed.addField('America', `${e[1]} ${message.translations.commands.mkw_players || "Translation error"}`);
        else if(e[0] === 'jap') embed.addField('Japan', `${e[1]} ${message.translations.commands.mkw_players || "Translation error"}`);
        else if(e[0] === 'eur') embed.addField('Europe', `${e[1]} ${message.translations.commands.mkw_players || "Translation error"}`);
    });
    embed.setColor(message.embedColors[Math.floor(Math.random() * message.embedColors.length)])
        .setFooter(message.translations.commands.refresh_footer)
        .setTimestamp(new Date(message.wiimmfi_api.lastCheck));
    message.channel.send(embed);
};
