export interface Fact {
	id: string,
	text: string,
	source: string,
	language: string,
	permalink: string
}

export interface Insult {
	number: string,
	language: string,
	insult: string,
	created: string,
	shown: string,
	createdBy: string,
	active: string,
	comment: string
}

export interface Joke {
	error: boolean,
	category: string,
	type: 'single' | 'twopart',
	joke: string,
	setup: string,
	delivery: string,
	flags: JokeFlags,
	id: number,
	safe: boolean,
	lang: string
}

interface JokeFlags {
	nsfw: boolean,
	religious: boolean,
	political: boolean,
	racist: boolean,
	sexist: boolean,
	explicit: boolean
}
