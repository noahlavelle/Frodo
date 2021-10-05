import WebSocket from 'ws';
import {sortScoreboard} from './scoreboard';
import btoa from 'btoa';

const votes = [];
let error = false;
let authed = false;
export let reconnecting = false;
export let webSocketPing = 0;
export let leaderboardCurrent = sortScoreboard();
const pingStats = {
	sent: 0,
	received: 0,
};

let pingIntervalId;
let intervalId;

let onVote: (id: string) => void = () => {};

function connect() {
	let ws;
	try {
		ws = new WebSocket(process.env.RUNTIME ? 'wss://frodo.fun' : 'ws://localhost');
	} catch (err) {
		return console.log('(Init) Failed to connect to WebSocket, trying again in 1 minute');
	}

	ws.on('error', (e) => {
		console.error(e);
		console.log('(Error Event) Failed to connect to WebSocket, trying again in 1 minute');
		ws.close();
	});

	ws.on('open', () => {
		reconnecting = false;
		ws.send(`init:${process.env.TOPGGAUTH}`);

		pingStats.sent = Date.now();
		leaderboardCurrent = sortScoreboard();
		ws.send(`ping:${btoa(JSON.stringify(leaderboardCurrent))}`);
		pingIntervalId = setInterval(() => {
			if (ws.closed) return clearInterval(pingIntervalId);
			pingStats.sent = Date.now();
			leaderboardCurrent = sortScoreboard();
			ws.send(`ping:${btoa(JSON.stringify(leaderboardCurrent))}`);
		}, 30000);
	});

	ws.on('message', (event) => {
		if (error) return;
		try {
			const {payload, data} = JSON.parse(event.toString());
			if (!authed) {
				if (payload === 'Authed') {
					ws.send('votes');
					console.log('WebSocket Authorised!');
					authed = true;
				} else return;
			} else {
				switch (payload) {
				case 'votes':
					data.forEach((vote) => {
						if (!votes.includes(vote)) votes.push(vote);
					});
					break;
				case 'vote':
					if (!votes.includes(data)) votes.push(data);
					onVote(data);
					break;
				case 'pong':
					pingStats.received = Date.now();
					webSocketPing = pingStats.received - pingStats.sent;
					break;
				}
			}
		} catch (err) {
			console.error(err);
			error = true;
		}
	});

	ws.on('close', (event) => {
		if (error || reconnecting) return;
		reconnecting = true;
		console.log('WebSocket Disconnected');
		authed = false;
		let tries = 0;
		intervalId = setInterval(() => {
			if (error || !reconnecting) return clearInterval(intervalId);
			tries++;
			if (tries > 5) {
				error = true;
				console.log('Failed to reconnect to WebSocket');
				return clearInterval(intervalId);
			}
			console.log(`Attempting to reconnect to WebSocket... Attempt: ${tries}`);
			connect();
		}, 60000);
	});
}

export function hasVoted(id): boolean {
	if (error || reconnecting) return true;
	return votes.includes(id);
}

export function setVoteEvent(func: (id: string) => void) {
	onVote = func;
}

// if (process.env.RUNTIME) connect();
connect();
