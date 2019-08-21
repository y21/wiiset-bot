export interface CommandArgument {
    name: string;
    description: string;
    required: boolean;
}

export interface CommandData {
    name: string;
    description: string;
    args: CommandArgument[];
    guildOnly: boolean;
    run: any;
    category: string | null;
    ownerOnly: boolean;
}

export default class Command {
    public name: string;
    public description: string;
    public args: CommandArgument[] | undefined;
    public run: any;
    public guildOnly: boolean;
    public category: string | null;
    public ownerOnly: boolean;

    constructor(data: CommandData) {
        this.guildOnly = data.guildOnly;
        this.name = data.name;
        this.description = data.description;
        this.args = data.args;
        this.run = data.run;
        this.category = data.category;
        this.ownerOnly = data.ownerOnly;
    }
}