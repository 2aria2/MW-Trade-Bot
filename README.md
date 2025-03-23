# Minewind Essence Bot

A Discord bot designed to help Minewind players track and manage essences, blocks, and trading activities. While this project maintains a simple and focused approach, its development timeline was extended due to parallel work on a separate, more complex project that required significant attention (mw event bot and inf block farming).

This bot aims to serve the Minewind community with essential functionality without unnecessary complexity. It handles the core features needed for essence and block trading while remaining user-friendly and maintainable.

## Features

- Track essence prices and information
- Monitor block spawns and infinity block prices
- Manage sell lists for essences and blocks
- Search and view items for sale
- Get seller information
- Buy list system for players to post their purchase requests
- And more!

## Planned Features

The following features are planned for future updates:

- Aura-related commands for tracking and trading
- Bounties (for specific item requirements that users has put out)
- Regular item trading support
- Additional quality-of-life improvements based on community feedback

## Setup Guide

### Prerequisites

- Node.js (v16.9.0 or higher)
- MySQL Server
- Discord Bot Token
- Discord Developer Application with proper intents enabled

### Installation

1. Clone the repository
```bash
git clone https://github.com/2aria2/minewind-ess-bot.git
cd minewind-ess-bot
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
# Bot Configuration
TOKEN=your_discord_bot_token
CLIENT_ID=your_client_id
GUILD_ID=your_guild_id

# Database Configuration
DB_HOST=localhost
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=your_database_name

# Environment
NODE_ENV=development
```

4. Set up the database
- Create a MySQL database with the name specified in your `.env`
- The tables will be automatically created on first run

### Running the Bot

#### Development Mode
```bash
npm run deployDev
```

#### Production Mode
```bash
npm run deployProd
```

#### Using PM2 (Recommended for Production)
```bash
npm run deployProdPm2
```

### Discord Setup

1. Create a Discord application at [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a bot for your application
3. Enable the following intents:
   - Server Members Intent
   - Message Content Intent
   - Presence Intent
4. Invite the bot to your server using the OAuth2 URL Generator
   - Required permissions: `Send Messages`, `Embed Links`, `Read Message History`

## Usage

For detailed information on how to use the bot and its commands, please refer to our [User Guide](user%20guide.md).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

If you encounter any issues or have questions, please open an issue on GitHub.
