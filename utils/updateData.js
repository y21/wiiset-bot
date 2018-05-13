module.exports = async (get) => {
    let wiimmfi_api = { };
    wiimmfi_api.text = JSON.parse((await get('https://wiimmfi.glitch.me/amount')).text);
    wiimmfi_api.text.regions = JSON.parse((await get('https://wiimmfi.glitch.me/regions')).text);
    wiimmfi_api.lastCheck = Date.now();
    return wiimmfi_api;
};
