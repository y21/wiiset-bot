module.exports = class ListCommand {
    static run(message) {
        message.channel.send(new message.Discord.RichEmbed()
            .setTitle(message.translations.commands.mkw_room_list || "Translation error")
            .setDescription((message.translations.commands.mkw_rooms || "Translation error").replace(/\{rooms\}/g, Object.values(message.wiimmfi_api.text.available).reduce((a, b) => parseInt(b)+parseInt(a))-message.wiimmfi_api.text.available.players))
            .setColor(message.embedColors[Math.floor(Math.random() * message.embedColors.length)])
            .setThumbnail('http://chadsoft.co.uk/wiimmfi/wiimmfi-dark.png')
            .addField(message.translations.commands.mkw_ww_rooms || "Translation error", message.wiimmfi_api.text.available.worldwides)
            .addField(message.translations.commands.mkw_continental_rooms || "Translation error", message.wiimmfi_api.text.available.continentals)
            .addField(message.translations.commands.mkw_private_rooms || "Translation error", message.wiimmfi_api.text.available.privates)
            .addField(message.translations.commands.mkw_players || "Translation error", message.wiimmfi_api.text.available.players)
            .setFooter(message.translations.commands.refresh_footer || "Translation error")
            .setTimestamp(new Date(message.wiimmfi_api.lastCheck))
        );
    }
};