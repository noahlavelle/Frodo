import {FrodoClient, Message} from '../../../FrodoClient';
import fetch from 'node-fetch';
import {Fact} from './Fact.d';

export default async function(this: FrodoClient, message: Message) {
	fetch('https://uselessfacts.jsph.pl/random.json?language=en')
		.then((res) => res.json())
		.then(async (json: Fact) => message.edit(json.text))
		.catch(() => {
		 	message.edit('We could not find you a fact :confused:');
		});
}
