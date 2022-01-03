import {User} from 'discord.js';
import {getLeaderboardObj, setLeaderboard, setLeaderboardObj} from './firebase.js';

export let scoreboard;
export let scoreboardArray = [];
(async () => {
	scoreboard = (await getLeaderboardObj()).val() || {};
})();

export function sortScoreboard() {
	const sortingArray = [];
	Object.keys(scoreboard).forEach((key, index) => {
		sortingArray.push([key, scoreboard[key]]);
	});
	sortingArray.sort((a, b) => b[1].score - a[1].score);
	setLeaderboard(sortingArray.slice(0, 10));
	scoreboardArray = sortingArray.slice(0, 10);
}

export function addUserToScoreboard(user: User, score = 1) {
	scoreboard[user.id] ? scoreboard[user.id].score += score : scoreboard[user.id] = {
		score,
		username: user.username,
		avatar: user.avatarURL(),
	};
	setLeaderboardObj(scoreboard);
}
