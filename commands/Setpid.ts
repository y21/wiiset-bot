import Command from "../structures/Command";
import Base from "../Base";

export default <Command>{
    name: "setpid",
    description: "Attaches a Profile ID to your Discord account.",
    args: [{
        name: "pid",
        description: "The Profile ID to attach",
        required: true
    }],
    guildOnly: false,
    category: "ctgp",
    ownerOnly: false,
    run: (base: Base, message: any) => {
        return new Promise(async (a: any, b: any) => {
            const args: string[] = message.content.split(" ").slice(1);
            if (!/^[A-Z0-9]+$/.test(args[1]))
                return b("Invalid Profile ID.");
                const dbPID = await base.sqlite.get("SELECT pid FROM pids WHERE user = ?", message.author.id);
                if (!dbPID) {
                    base.sqlite.run("INSERT INTO pids VALUES (?, ?)", message.author.id, args[1]).then(() => {
                        a(["Profile ID successfully set."]);
                    }).catch(b);
                } else {
                    base.sqlite.run("UPDATE pids SET pid = ? WHERE user = ?", args[1], message.author.id).then(() => {
                        a(["Profile ID successfully updated."]);
                    }).catch(b);
                }
        });
    }
}