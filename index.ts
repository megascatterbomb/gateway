import Discord, { GuildMember, Message, MessageReaction, PartialMessageReaction, Partials, PartialUser, User } from 'discord.js';

console.log("Starting process...")

require("dotenv").config();

const client = new Discord.Client({
    intents: ['Guilds', 'GuildMessages', 'GuildMessageReactions', 'GuildMembers', 'DirectMessageReactions'],
    partials: [Partials.User, Partials.Message, Partials.Reaction]
});

client.on('ready', () => {
    console.log(`Logged in as ${client.user?.tag}!`);
    client.channels.fetch(channelID);
    client
    setup();
});

const channelID = process.env.ENTRANCE_CHANNEL ?? ""; // ID of the channel where the message is
const messageID = process.env.ENTRANCE_MESSAGE ?? ""; // ID of the specific message
const emojiID = process.env.ENTRANCE_EMOJI ?? "";
const roleID = process.env.ENTRANCE_ROLE ?? "";

console.log("CHANNEL: " + channelID);
console.log("MESSAGE: " + messageID);
console.log("EMOJI: " + emojiID);
console.log("ROLE: " + roleID);

function setup() {
    client.on('messageReactionAdd', (reaction, user) => {
        handleReaction(reaction, user);
    });

    client.on('guildMemberAdd', (member) => {
        handleJoin(member)
    });
}

async function handleJoin(member: GuildMember) {
    console.log("Member Joined: " + member.id)
    await member?.roles.add(roleID);
}

async function handleReaction(reaction: MessageReaction | PartialMessageReaction, user: User | PartialUser) {
    if (reaction.partial) {
        try {
            await reaction.fetch();
        } catch (error) {
            console.error('Error fetching reaction:', error);
            return;
        }
    }
    console.log("Checking reaction... "+ reaction.message.id + " - " + reaction.emoji.id)
    if (reaction.emoji.id === emojiID && reaction.message.id === messageID) {
        try {
            const guild = reaction.message.guild;
            const member = await guild?.members.fetch(user.id);
            if(member?.roles.cache.has(roleID)) {
                await member?.roles.remove(roleID);
                await reaction.users.remove(user.id);
                console.log("Member Verified: " + user.id)
            }
            
        } catch {

        }
    }
}

client.login(process.env.DISCORD_TOKEN);