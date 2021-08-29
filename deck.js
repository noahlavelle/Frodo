"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Deck = exports.Card = void 0;
const node_fetch_1 = require("node-fetch");
class Card {
}
exports.Card = Card;
class Images {
}
class Deck {
    async init() {
        this.deckId = (await (await node_fetch_1.default('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')).json()).deck_id;
        return;
    }
    async draw(amount = 1) {
        const req = await ((await node_fetch_1.default(`https://deckofcardsapi.com/api/deck/${this.deckId}/draw/?count=${amount}`)).json());
        const cards = req.cards;
        return cards;
    }
    async shuffle() {
        return await node_fetch_1.default(`https://deckofcardsapi.com/api/deck/${this.deckId}/shuffle/`);
    }
}
exports.Deck = Deck;
//# sourceMappingURL=deck.js.map