import fetch from 'node-fetch';

const emojis = {
	'AH': '<:AH:881655401228173393>',
	'2H': '<:2H:881655400800354315>',
	'3H': '<:3H:881655400699662427>',
	'4H': '<:4H:881655400884207657>',
	'5H': '<:5H:881655400947134495>',
	'6H': '<:6H:881655401228161044>',
	'7H': '<:7H:881655400913596537>',
	'8H': '<:8H:881655401400119316>',
	'9H': '<:9H:881655401362386954>',
	'10H': '<:10H:881655401416904744>',
	'JH': '<:JH:881655401001656368>',
	'QH': '<:QH:881655401446277150>',
	'KH': '<:KH:881660397642453052>',

	'AD': '<:AD:881655401060384820>',
	'2D': '<:2D:881655400611586120>',
	'3D': '<:3D:881655401194594325>',
	'4D': '<:4D:881655400993263667>',
	'5D': '<:5D:881655400632549397>',
	'6D': '<:6D:881655401433681920>',
	'7D': '<:7D:881655400884215819>',
	'8D': '<:8D:881655401182003201>',
	'9D': '<:9D:881655401337212928>',
	'10D': '<:10D:881655401421099018>',
	'JD': '<:JD:881655401299447898>',
	'QD': '<:QD:881655401387552768>',
	'KD': '<:KD:881655401567911936>',

	'AC': '<:AC:881655401546932305>',
	'2C': '<:2C:881655400875819029>',
	'3C': '<:3C:881655400599003137>',
	'4C': '<:4C:881655400619999263>',
	'5C': '<:5C:881655400972320809>',
	'6C': '<:6C:881655401219756063>',
	'7C': '<:7C:881655401165234186>',
	'8C': '<:8C:881655401295257661>',
	'9C': '<:9C:881655401630822410>',
	'10C': '<:10C:881655401312030790>',
	'JC': '<:JC:881655401270083614>',
	'QC': '<:QC:881655401421086780>',
	'KC': '<:KC:881655401119096833>',

	'AS': '<:AS:881655401119121410>',
	'2S': '<:2S:881655400901017700>',
	'3S': '<:3S:881655400934547466>',
	'4S': '<:4S:881655400955539487>',
	'5S': '<:5S:881655401358172211>',
	'6S': '<:6S:881655401291087942>',
	'7S': '<:7S:881655400976515073>',
	'8S': '<:8S:881655401429491743>',
	'9S': '<:9S:881655401312055306>',
	'10S': '<:10S:881660397646676018>',
	'JS': '<:JS:881655401043595306>',
	'QS': '<:QS:881655401404305459>',
	'KS': '<:KS:881660397642457108>',

	'back': '<:back:881661068089368627>',
};

export class Card {
	public code: string;
	public image: string;
	public images: Images;
	public value: 'ACE' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'JACK' | 'QUEEN' | 'KING';
	public suit: 'CLUBS' | 'DIAMONDS' | 'HEARTS' | 'SPADES';
	public emoji: string;
}
class Images {
	public svg: string;
	public png: string;
}
export class Deck {
	private deckId: string;
	public backEmoji: string;

	async init() {
		this.backEmoji = emojis.back;
		this.deckId = (await (await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')).json()).deck_id;
		return;
	}
	async draw(amount=1): Promise<Card[]> {
		const req = await ((await fetch(`https://deckofcardsapi.com/api/deck/${this.deckId}/draw/?count=${amount}`)).json());
		const cards = <Card[]> req.cards;
		cards.forEach((card, index) => {
			cards[index].emoji = emojis[card.code];
		});
		return cards;
	}
	async shuffle() {
		return await fetch(`https://deckofcardsapi.com/api/deck/${this.deckId}/shuffle/`);
	}
}
