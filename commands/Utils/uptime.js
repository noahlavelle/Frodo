"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uptime = void 0;
const index_1 = require("../../index");
const moment = require("moment");
require('moment-duration-format');
function uptime(interaction) {
    // @ts-ignore
    interaction.reply(moment.duration(index_1.client.uptime).format(' D [days], H [hrs], m [mins], s [secs]'));
}
exports.uptime = uptime;
;
//# sourceMappingURL=uptime.js.map