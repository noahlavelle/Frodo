const { DMChannel, Collection } = require("discord.js");
const utils = require('../../utils');
const fetch = require("node-fetch");

module.exports = {
	name: 'trivia',
    description: 'Answer trivia questions',
    guildOnly: true,
	execute(message, args, client) {
        if (!args.length) get_data()
        function get_data(dif, cat) {
            if (!dif && !cat) {
                fetch('https://opentdb.com/api.php?amount=1')
                .then(response => response.json())
                .then(data => console.log(data));
            }
        }
	},
};