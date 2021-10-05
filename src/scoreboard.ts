import {User} from 'discord.js';

export const scoreboard = {};

export function sortScoreboard() {
	const sortingArray = [];
	Object.keys(scoreboard).forEach((key, index) => {
		sortingArray.push([key, scoreboard[key]]);
	});
	sortingArray.sort((a, b) => b[1].score - a[1].score);
	return sortingArray.slice(0, 10);
}

export function addUserToScoreboard(user: User, score = 1) {
	scoreboard[user.id] ? scoreboard[user.id].score += score : scoreboard[user.id] = {
		score,
		username: user.username,
		avatar: user.avatarURL(),
	};
}
