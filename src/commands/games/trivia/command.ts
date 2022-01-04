import {Command} from './../../../namespaces/Command.d';

export const command: Command = {
	name: 'trivia',
	description: 'A game of Trivia',
	options: [
		{
			'name': 'difficulty',
			'description': 'Select the difficulty of the question',
			'choices': [
				{
					'name': 'easy',
					'description': 'Easy',
				},
				{
					'name': 'medium',
					'description': 'Medium',
				},
				{
					'name': 'hard',
					'description': 'Hard',
				},
			],
			'required': false,
			'type': 'STRING',
		},
		{
			'name': 'category',
			'description': 'Select the category of the question',
			'choices': [
				{
					'name': 'General Knowledge',
					'description': 'General Knowledge',
				},
				{
					'name': 'Entertainment: Books',
					'description': 'Entertainment: Books',
				},
				{
					'name': 'Entertainment: Film',
					'description': 'Entertainment: Film',
				},
				{
					'name': 'Entertainment: Music',
					'description': 'Entertainment: Music',
				},
				{
					'name': 'Entertainment: Musicals & Theatres',
					'description': 'Entertainment: Musicals & Theatres',
				},
				{
					'name': 'Entertainment: Television',
					'description': 'Entertainment: Television',
				},
				{
					'name': 'Entertainment: Video Games',
					'description': 'Entertainment: Video Games',
				},
				{
					'name': 'Entertainment: Board Games',
					'description': 'Entertainment: Board Games',
				},
				{
					'name': 'Science & Nature',
					'description': 'Science & Nature',
				},
				{
					'name': 'Science: Computers',
					'description': 'Science: Computers',
				},
				{
					'name': 'Science: Mathematics',
					'description': 'Science: Mathematics',
				},
				{
					'name': 'Mythology',
					'description': 'Mythology',
				},
				{
					'name': 'Sports',
					'description': 'Sports',
				},
				{
					'name': 'Geography',
					'description': 'Geography',
				},
				{
					'name': 'History',
					'description': 'History',
				},
				{
					'name': 'Politics',
					'description': 'Politics',
				},
				{
					'name': 'Art',
					'description': 'Art',
				},
				{
					'name': 'Celebrities',
					'description': 'Celebrities',
				},
				{
					'name': 'Animals',
					'description': 'Animals',
				},
				{
					'name': 'Vehicles',
					'description': 'Vehicles',
				},
				{
					'name': 'Entertainment: Comics',
					'description': 'Entertainment: Comics',
				},
				{
					'name': 'Science: Gadgets',
					'description': 'Science: Gadgets',
				},
				{
					'name': 'Entertainment: Japanese Anime & Manga',
					'description': 'Entertainment: Japanese Anime & Manga',
				},
				{
					'name': 'Entertainment: Cartoon & Animations',
					'description': 'Entertainment: Cartoon & Animations',
				},
			],
			'required': false,
			'type': 'STRING',
		},
	],
	version: '1.0.0',
	main: './trivia.js',
};