const fetch = require("node-fetch");
const { captionAPI } = require("../../configs/apis");

module.exports = {
    name: "caption",
    ownerOnly: false,
    guildOnly: false,
    metadata: {
        description: "Describes an image"
    },
    run: async (_, args) => {
        const url = args.join(" ");
        if (!url) throw new Error("No URL provided");

        const request = await fetch(captionAPI, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                Type: "CaptionRequest",
                Content: url
            })
        });

        return [await request.text()];
    }
};