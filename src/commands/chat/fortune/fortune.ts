import {FrodoClient, Message} from '../../../FrodoClient';
import fetch from 'node-fetch';

export default async function(this: FrodoClient, message: Message) {
	fetch('https://fortuneapi.herokuapp.com/')
		.then((res) => res.json())
		.then(async (text) => message.edit(text))
		.catch(() => {
			message.edit('We could not find you a fortune :confused:');
		});
}
