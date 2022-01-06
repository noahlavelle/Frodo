import dotenv from 'dotenv';
dotenv.config();

import {Intents} from 'discord.js';
import {FrodoClient} from './FrodoClient.js';

const client = new FrodoClient({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.DIRECT_MESSAGE_REACTIONS]});
