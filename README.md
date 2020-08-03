[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]


<br />
<p align="center">
  <a href="https://github.com/NoahLavelle/Frodo">
    <img src="https://i.imgur.com/isGWJ9E.jpg" alt="Logo" width="180" height="180">
  </a>

  <h3 align="center">FRODO - Discord Games Bot</h3>

  <p align="center">
    A work in progress server entertainment bot that aims to have economy games, games like Werewolves, easy to use party features and fun mini games. It will also have per server configs and features like total server backups. 
    <br />
    <a href="https://github.com/NoahLavelle/Frodo"><strong>Explore the Repo»</strong></a>
    <br />
    <br />
    <a href="https://discord.com/api/oauth2/authorize?client_id=737984800689750090&permissions=8&scope=bot">Invite to your server</a>
    ·
    <a href="https://github.com/NoahLavelle/Frodo/issues">Report Bug</a>
    ·
    <a href="https://github.com/NoahLavelle/Frodo/issues">Request Feature</a>
  </p>
</p>



<!-- TABLE OF CONTENTS -->
## Table of Contents

* [About the Project](#about-the-project)
	* [Features](#features)
	* [Built With](#built-with)
* [Getting Started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
* [Usage](#usage)
* [Roadmap](#roadmap)
* [License](#license)
* [Acknowledgements](#acknowledgements)



<!-- ABOUT THE PROJECT -->
## About The Project

There are many bots out there that can do games, but this one aimes to bring them all together. It is currently being worked on by Daniel Howard and Noah Lavelle for fun and to develop skills. It is being constantly updated and will soon have features like minigames - RPS, TTT, number games etc, and a more advanced party system for server-wide games like Werewolves. We also intend to create an economy based game.

### Features

The bot currently has quite a few games. The full list currently is
* Connect 4,
* Akinator,
* Hangman,
* Rock Paper Scissors,
* Trivia,
* Tick Tack Toe,
* Countdown style anagrams.
* Chase the Ace - Almost completed,
All of these are within the discord chat and are quite polished. The current major games in development is Wearwolves and a set of card games. The bot does not only provide games though. 
There are also many different simple text commands like joke, fact, fortune, insult and most importantly, chucknorris. The bot also has per server configs for things like prefixes and also full server backups! This covers rolls, settings, channels and even messages!
### Built With
Here are the frameworks and dependancies we are using. They may change alot and you can install them for yourself by running ``npm i`` - asuming you have NodeJS installed
* [NodeJS](https://nodejs.org/en/)
* [DiscordJS](https://discord.js.org/#/)



<!-- GETTING STARTED -->
## Getting Started

This is how to get the bot up and running on your own machine. You need to install NodeJS [here](https://nodejs.org/en/) and then either download the repo as a zip and open it or use [Git](https://git-scm.com/) to clone the repo. Open it in your editor of choise and its in-built terminal or a command prompt to install the prerequisites.

### Prerequisites

These are all of the node moduals the bot uses. Read through the [Installation](#installation) section to see how to install them all at once
* npm
```sh
discord.js
aki-api
atob
better-sqlite3
discord-backup
discord.js
enmap
moment + moment-duration-format
node-fetch
```

### Installation

2. Clone the repo
```sh
git clone https://github.com/NoahLavelle/Frodo.git
```
3. Install NPM packages
```sh
npm i
```
4. Create a `config.json` file in the same folder as the index.js with this inside. Change `bot-token` with your bot token.
```JSON
{
	"token": "bot-token"
}
```
You can obtain a key [here](https://discord.com/developers/applications) by creating an aplication and adding a bot to it.



<!-- USAGE EXAMPLES -->
## Usage

Once you have entered your key you can run the bot by entering ``npm start`` in a terminal. This will start the bot on your computer.


<!-- ROADMAP -->
## Roadmap

See the [open issues](https://github.com/NoahLavelle/Frodo/issues) for a list of proposed features (and known issues).

<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.

<!-- ACKNOWLEDGEMENTS -->
## Acknowledgements
* More will come here soon





<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/NoahLavelle/Frodo.svg?style=flat-square
[contributors-url]: https://github.com/NoahLavelle/Frodo/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/NoahLavelle/Frodo.svg?style=flat-square
[forks-url]: https://github.com/NoahLavelle/Frodo/network/members
[stars-shield]: https://img.shields.io/github/stars/NoahLavelle/Frodo.svg?style=flat-square
[stars-url]: https://github.com/NoahLavelle/Frodo/stargazers
[issues-shield]: https://img.shields.io/github/issues/NoahLavelle/Frodo.svg?style=flat-square
[issues-url]: https://github.com/NoahLavelle/Frodo/issues
[license-shield]: https://img.shields.io/github/license/NoahLavelle/Frodo.svg?style=flat-square
[license-url]: https://github.com/NoahLavelle/Frodo/blob/master/LICENSE.txt
[product-screenshot]: images/screenshot.png
