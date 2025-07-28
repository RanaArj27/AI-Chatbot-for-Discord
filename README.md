# AI Chatbot for Discord
A customizable AI chatbot for discord made in JavaScript with the Google Gemini API

# Installation

## Preqrequisites
Have an IDE installed

Install the latests version of node.js

A Discord account

A Google account

## Creating the Bot
Go to discord.com/developers/applications and create an application

Once it is created, you can set the name, profile photo, and description

Under the Bot tab, turn on all of the options under "Privileged Gateway Intents" and turn on "Public Bot" under Authorization Flow

<img width="394.25" height="223.25" alt="image" src="https://github.com/user-attachments/assets/834cee0e-379e-49da-9ad6-7cf743684208" />

Under the OAuth2 tab, tick the "bot" and "application.commands" boxes, then grant the bot the permissions you want it to have in the Discord server

Scroll to the bottom of the tab and copy the generated URL

Paste the URL into a Discord server and click it to install the bot (must have Administrator permissions in the server to do this!)

Go back to the Discord developer page and under the Bot tab, click on Reset Token, and save the token where you can remember it (This will be important later)

## Implementation

Clone and save the repository to your device

Open the folder in a IDE

In the ".env" file, paste your Gemini API key into the "GEMINI_API_KEY" variable (aistudio.google.com), and your Discord bot token into "TOKEN"

## Customization
### In the main file "index.js", there are instructions for many available parameters with bot customization options including

  -personality

  -rate limits

  -user exceptions

  -active channels

  -and more

## Launching

### Open a new terminal and run the following commands:

  npm init -y

  npm install discord.js

  npm install dotenv

  npm install node-fetch

### To launch the bot, run:

node index.js (in a new terminal)

### To bring it offline 

kill the terminal

