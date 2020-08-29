import BaseCommand from '../structures/basecommand';
import { Context } from 'detritus-client/lib/command';
import { Client } from '../client';
import Cmd from '../structures/basecommand';
import Lobby, { LobbyOptions } from '../ttc/lobby';
import { hasOption, formatConstantKey } from '../utils/utils';
import { Message } from 'detritus-client/lib/structures';
import { TTC_VERSION, NUMBER_EMOJIS } from '../utils/constants';
import { AiDifficulty } from '../ttc/user';

interface UserData {
    options: number;
    response: Message,
    client: Client,
    context: Context
}

const MAX_ROUNDS = 7; // 1 << 7 = 128

const CPU_REACTIONS = Object.fromEntries(
    [
        'EASY',
        'MEDIUM',
        'HARD',
        'EXPERT',
        'RANDOM',
        'RANDOMIZE_ALL',
        'STOP'
    ].map((x, i) => [x, NUMBER_EMOJIS[i]])
);

const TEAM_REACTIONS = Object.fromEntries(
    [
        '2v2',
        '3v3',
        '4v4',
        '6v6'
    ].map((x, i) => [x, NUMBER_EMOJIS[i]])
);

export default <Cmd>{
    name: 'ttc createlobby',
    ownerOnly: false,
    metadata: {
        description: 'Creates a TTC Lobby'
    },
    onrun: async function(client, context, args) {
        const fargs: Array<string> = args[this.name].split(' ');
        if (args.length < 1) {
            throw new Error('Invalid lobby options.');
        }

        let options: number;

        if (fargs[0] === 'random') {
            options = randomizeOptions();
        } else {
            const fmtOptions = fargs
                .join('')
                .split(/, */g)
                .filter(x => LobbyOptions[x]);

            if (fmtOptions.length < 1) {
                throw new Error('Option(s) not found.');
            }

            options = fmtOptions.reduce((a, b) => (+a) | (+LobbyOptions[b]), 0);
        }

        const response = await context.reply('Creating lobby...');
        await createLobby({ options, response, client, context });
    }
}

function buildCpuMessage(idx: number) {
    return {
        embed: {
            color: 0x2ecc71,
            title: `TT-Competition ${TTC_VERSION} | CPU #${idx + 1}`,
            description: 'React with one of the emojis below to set the difficulty for this CPU\n' +
                Object.entries(CPU_REACTIONS).map(([k, v]) => v + ' ' + formatConstantKey(k)).join('\n')
        }
    };
}

function handleBots(client: Client, context: Context, response: Message): Promise<Array<number>> {
    return new Promise(async (resolve) => {
        await response.edit({
            ...buildCpuMessage(0),
            content: undefined
        });

        const botDiffs: Array<number> = [];
        const paginator = await client.paginator.createReactionPaginator({
            message: context.message,
            commandMessage: response,
            reactions: CPU_REACTIONS
        });

        paginator.on('raw', (data) => {
            const { emoji } = data;

            switch (emoji.name) {
                case CPU_REACTIONS.EASY:
                    botDiffs.push(AiDifficulty.EASY);
                    break;
                case CPU_REACTIONS.MEDIUM:
                    botDiffs.push(AiDifficulty.MEDIUM);
                    break;
                case CPU_REACTIONS.HARD:
                    botDiffs.push(AiDifficulty.HARD);
                    break;
                case CPU_REACTIONS.EXPERT:
                    botDiffs.push(AiDifficulty.EXPERT);
                    break;
                case CPU_REACTIONS.RANDOM:
                    botDiffs.push(Lobby.randomizeSingleBotDiff());
                    break;
                case CPU_REACTIONS.RANDOMIZE_ALL:
                    const count = ~~(Math.random() * (Lobby.BOTS_LIMIT - botDiffs.length));
                    botDiffs.push(...Lobby.randomBotDiffs(count));
                    break;
                case CPU_REACTIONS.STOP:
                    paginator.stop();
                    return resolve(botDiffs);
            }

            if (botDiffs.length >= Lobby.BOTS_LIMIT) {
                paginator.stop();
                return resolve(botDiffs);
            }

            response.edit({
                ...buildCpuMessage(botDiffs.length),
                content: undefined
            })
        });
    });
}

function handleTeams(client: Client, context: Context, response: Message): Promise<number> {
    return new Promise(async (resolve) => {
        await response.edit({
            embed: {
                color: 0x2ecc71,
                title: `TT-Competition ${TTC_VERSION} | Team size`,
                description: 'React with one of the emojis below to set the team size for this lobby\n' +
                    Object.entries(TEAM_REACTIONS).map(([k, v]) => `${v} ${k}`).join('\n')
            }
        });

        const paginator = await client.paginator.createReactionPaginator({
            message: context.message,
            commandMessage: response,
            reactions: TEAM_REACTIONS
        });

        paginator.on('raw', (data) => {
            const { emoji } = data;

            switch (emoji.name) {

            }
        });
    });
}

async function createLobby(userData: UserData) {
    let botDiffs: Array<number>, maxRounds: number;

    if (hasOption(userData.options, LobbyOptions.Bots)) {
        botDiffs = await handleBots(
            userData.client,
            userData.context,
            userData.response
        );
    }

    if (hasOption(userData.options, LobbyOptions.Teams)) {
        userData.options |= await handleTeams(
            userData.client,
            userData.context,
            userData.response
        );
    }
}