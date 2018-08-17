module.exports = async (fetch) => {
    let wiimmfi_api = { };
    let currentRequest = await fetch("https://wiimmfi.glitch.me/mkw/amount");
    wiimmfi_api.text = await currentRequest.json();
    currentRequest = await fetch("https://wiimmfi.glitch.me/mkw/regions");
    wiimmfi_api.text.regions = await currentRequest.json();
    currentRequest = await fetch("https://wiimmfi.glitch.me/ssbb/amount");
    wiimmfi_api.text.ssbb = await currentRequest.json();
    currentRequest = await fetch("http://tt.chadsoft.co.uk/index.json");
    wiimmfi_api.ctgp = {
        recent: await currentRequest.text()
    }
    if(!wiimmfi_api.ctgp.recent.startsWith("{")) wiimmfi_api.ctgp.recent = JSON.parse(wiimmfi_api.ctgp.recent.substr(1));
    wiimmfi_api.lastCheck = Date.now();
    return wiimmfi_api;
};
