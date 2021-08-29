import {client} from '../../index';
import moment = require('moment');
require('moment-duration-format');

export function uptime(interaction) {
	// @ts-ignore
	interaction.reply(moment.duration(client.uptime).format(' D [days], H [hrs], m [mins], s [secs]'));
};
