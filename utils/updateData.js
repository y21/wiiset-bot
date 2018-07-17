module.exports = async (get) => {
    let wiimmfi_api = { };
    wiimmfi_api.text = JSON.parse((await get('https://wiimmfi.glitch.me/amount')).raw.toString());
    wiimmfi_api.text.regions = JSON.parse((await get('https://wiimmfi.glitch.me/regions')).raw.toString());
    wiimmfi_api.text.ssbb = JSON.parse((await get("https://wiimmfi.glitch.me/ssbb/amount")).raw.toString());
    wiimmfi_api.ctgp = {
        recent: await get("http://tt.chadsoft.co.uk/index.json")
    };
    if (!wiimmfi_api.ctgp.recent.body.startsWith("{")) wiimmfi_api.ctgp.recent.body = wiimmfi_api.ctgp.recent.body.substr(1);
    wiimmfi_api.ctgp.recent = JSON.parse(wiimmfi_api.ctgp.recent.body);
    wiimmfi_api.lastCheck = Date.now();
    return wiimmfi_api;
};
