import Command from "../structures/Command";
import Base from "../Base";
import fetch from "node-fetch";

export default <Command>{
    name: "caption",
    description: "Identifies an image",
    args: [{
       name: "image",
       description: "The image to identify (can also be sent as an attachment)",
       required: false
    }],
    guildOnly: false,
    category: null,
    ownerOnly: false,
    run: async (base: Base, message: any) => {
        const imageURL: string | undefined = message.attachments.size > 0 ? message.attachments.first().url : message.args.join(" ");
        if (!imageURL) return ["please provide an image either by sending one or by sending a link"];
        return new Promise((a: any, b: any) => {
            fetch("https://captionbot.azurewebsites.net/api/messages?language=en-US", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    Type: "CaptionRequest",
                    Content: imageURL
                })
            }).then(v => v.text()).then(res => {
                a([res]);
            }).catch(err => {
                b(err);
            });
        });
    }
}