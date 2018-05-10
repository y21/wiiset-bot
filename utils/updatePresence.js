module.exports = (wiimmfi_api, client) => {
    if(!wiimmfi_api.lastCheck) return;
    return client.user.setActivity(`w.help | ${wiimmfi_api.text.available.players} players in ${Object.values(wiimmfi_api.text.available).reduce((a,b)=>parseInt(a)+parseInt(b))-wiimmfi_api.text.available.players} rooms`);
};
