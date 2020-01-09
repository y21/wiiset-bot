module.exports = {
    name: "help",
    ownerOnly: false,
    guildOnly: false,
    run: async () => {
        return [`
This bot is being developed by y21. It uses the Ghost Database API for CTGP commands and other external APIs for stuff like the cat command.
The code might have some bugs as there was a rewrite going on over the past few weeks. If you find one, please report it.
__Support Server__
https://discord.gg/6DPWSmK

__Source Code__
<https://github.com/y21/wiiset-bot>

__Invite Link__
<https://discordapp.com/api/oauth2/authorize?client_id=440210686954569739&permissions=0&scope=bot>
        `.trim()];
    }
};