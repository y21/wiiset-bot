import Command from "../structures/Command";
import Base from "../Base";
import fetch from "node-fetch";
import { Attachment } from "discord.js";

export default <Command>{
    name: "cat",
    description: "Sends a random cat picture using an external API",
    args: [],
    guildOnly: false,
    category: null,
    ownerOnly: false,
    run: (base: Base, message: any) => {
        return new Promise((a: any, b: any) => {
            fetch("http://aws.random.cat/meow").then(v => v.json()).then((res: any) => {
                a([new Attachment(res.file, "cat.jpg")]);
            }).catch((err: any) => {
                b(err);
            })
        });
    }
}