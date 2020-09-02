import { Context, Command } from "detritus-client/lib/command";
import { Client } from "../client";
import * as Constants from '../utils/constants';

export default interface Cmd<T = any> extends Command {
    onrun: (client: Client, context: Context, args: T) => any,
    ownerOnly?: boolean,
    metadata: {
        description: string
    },
    disabled?: boolean
}

export function onBefore(command: Cmd, context: Context) {
    return command.ownerOnly ? context.client.isOwner(context.userId) : true;
}

export function onCancel(context: Context) {
    return context.reply(Constants.UNKNOWN_CMD_ERROR);
}

export async function run<T = any>(client: Client, command: Cmd, context: Context, args: T) {
    try {
        await command.onrun(client, context, args);
    } catch(e) {
        // TODO: sanitize error message (hide IPs)
        await context.reply(e.message);
    }
}