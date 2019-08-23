import Command from "../structures/Command";
import Base from "../Base";
import fetch from "node-fetch";
import { URLSearchParams } from "url";

export default <Command>{
    name: "user",
    description: "Shows information about a CTGP profile such as ghosts, stars and more",
    args: [{
        name: "profile",
        description: "The profile to show. This can be either a mention or a profile ID if the mentioned user does not have one added.",
        required: false
    }],
    guildOnly: false,
    category: "mkw",
    ownerOnly: false,
    run: (base: Base, message: any) => {
        const args: string[] = message.content.split(" ").slice(1);
        return new Promise(async (a: any, b: any) => {
            const parameters: URLSearchParams = new URLSearchParams();
            parameters.append("name", args.slice(1).join(" "));
            fetch(`${Base.wiimmfiAPI}/mkw/findUser`, {
                method: "POST",
                body: parameters
            }).then((res: any) => res.json())
                .then(async (res: any) => {
                    if (res.status === 400) return b("User not found.");

                    let embed: any = {
                        title: `Information about player ${args.slice(1).join(" ")}`,
                        thumbnail: {
                            url : "http://chadsoft.co.uk/wiimmfi/wiimmfi-dark.png"
                        },
                        fields: [
                            {
                                name: "VR (Versus Rating)",
                                value: res.data.VR || "-"
                            },
                            {
                                name: "BR (Battle Rating)",
                                value: res.data.BR || "-"
                            },
                            {
                                name: "Login region",
                                value: res.data.loginRegion || "-"
                            },
                            {
                                name: "Game Type",
                                value: res.data.gameType || "-"
                            },
                            {
                                name: "Connection fail",
                                value: res.data.connectionFail || "-"
                            }
                        ]
                    };
                    const connectionFail: number = parseInt(res.data.connectionFail);
                    if(connectionFail){
                        if(connectionFail < 1 && connectionFail > 0) embed.color = 0x8cff00;
                        else if(connectionFail >= 1 && connectionFail < 3) embed.color = 0xc7ff00;
                        else if(connectionFail >= 3 && connectionFail < 6) embed.color = 0xffcc00;
                        else if(connectionFail >= 6 && connectionFail < 10) embed.color = 0xff7f00;
                        else if(connectionFail <= 10) embed.color = 0xff0000;
                    } else {
                        embed.color = 0x2aff00;
                    }
                    a([ { embed }]);
                }).catch(b);
        });
    }
}