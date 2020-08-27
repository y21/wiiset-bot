import { Context, Command, ParsedArgs } from "detritus-client/lib/command";
import { Client } from "../client";

export default interface Cmd<T = any> extends Command {
    onrun: (client: Client, context: Context, args: T) => any,
    ownerOnly?: boolean,
    metadata: {
        description: string
    },
    disabled?: boolean
}