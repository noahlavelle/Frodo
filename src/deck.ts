import fetch from 'node-fetch';

export class Card {
	public code: string;
	public image: string;
	public images: Images;
	public value: 'ACE' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'JACK' | 'QUEEN' | 'KING';
	public suit: 'CLUBS' | 'DIAMONDS' | 'HEARTS' | 'SPADES';
}
class Images {
	public svg: string;
	public png: string;
}
export class Deck {
	private deckId: string;

	async init() {
		this.deckId = (await (await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')).json()).deck_id;
		return;
	}
	async draw(amount=1): Promise<Card[]> {
		const req = await ((await fetch(`https://deckofcardsapi.com/api/deck/${this.deckId}/draw/?count=${amount}`)).json());
		const cards = <Card[]> req.cards;
		return cards;
	}
	async shuffle() {
		return await fetch(`https://deckofcardsapi.com/api/deck/${this.deckId}/shuffle/`);
	}
}
