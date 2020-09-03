export const PAGINATOR_TIME_LIMIT = 300_000;

export const SNOWFLAKE_REGEX = new RegExp('^\\d{17,19}$');
export const MENTION_REGEX = new RegExp('<@!?(\\d{17,19})>');
export const PID_REGEX = new RegExp('^[A-F\\d]{16}$', 'i');

export const TTC_VERSION = '1.1-beta';
export const TTC_AUTO_DETECT = 0;

export const NUMBER_EMOJIS = [ "1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣" ];
export const MEDALS = [ "🥇", "🥈", "🥉" ];
export const enum ConfirmationReactions {
    OK = '✅',
    NO = '❌'
}

export const UNKNOWN_CMD_ERROR = ':x: Command execution has been cancelled';
export const GUILD_OWNER_CMD = 'Only the owner of this server can run this command.';

export const DELIMITER = '-';

export interface Page {
    embed: {
        title: string,
        fields: Array<{
            name: string,
            value: string
        }>,
        inline?: boolean
    }
}