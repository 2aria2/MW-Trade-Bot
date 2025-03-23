# Minewind Essence Bot User Guide

## Core Commands

### Help Command
- Usage: `/help [category|command]`
- Description: Shows list of all available commands or detailed information about specific categories/commands
- Options:
  - `category`: View all commands in a specific category
  - `command`: Get detailed information about a specific command

### Ping Command
- Usage: `/ping`
- Description: Check if the bot is online and responsive

### Add Link Command
- Usage: `/addlink`
- Description: Add useful links to the bot's database

## Essence Commands

### Essence Price
- Usage: `/essenceprice`
- Description: Check current prices of essences

### Essences by Keys
- Usage: `/essencesbykeys`
- Description: Look up essences using specific key criteria

## Block Commands

### Block Spawn
- Usage: `/blockspawn`
- Description: Get information about block spawns

### Infinity Block Price
- Usage: `/infblockprice`
- Description: Check prices of infinity blocks

### List Commands
- `/listofblockspawn` - View all blocks available at spawn
- `/listofinfinityblocks` - View all available infinity blocks

## Sell List Commands

### Selling Items
- `/sell-block <block> <action> <quantity>` - List blocks for sale
  - Actions: Add or Subtract
  - Includes autocomplete for block names
- `/sell-essences <essence> <action> <quantity>` - List essences for sale
  - Actions: Add or Subtract
  - Includes autocomplete for essence names
- `/sale-list` - View all items currently listed for sale
  - Shows 30 items per page with pagination
- `/seller-info <user>` - Get information about what a seller has listed
  - Shows 30 items per page with pagination
- `/search-sell-list <item>` - Search the sell list for specific items
  - Shows 30 items per page with pagination

## Buy List Commands

### Buying Items
- `/buy-block <block> <action> <quantity>` - List blocks you want to buy
  - Actions: Add or Subtract
  - Includes autocomplete for block names
  - Quantity must be a positive number
- `/buy-essences <essence> <action> <quantity>` - List essences you want to buy
  - Actions: Add or Subtract
  - Includes autocomplete for essence names
  - Quantity must be a positive number

### Managing Buy Lists
- `/items-for-purchase` - View all items that players want to buy
  - Shows 30 items per page with pagination
  - Empty response if no items are being sought after
- `/buyer-info <user>` - View what items a specific user wants to buy
  - Shows 30 items per page with pagination
  - Empty response if user isn't looking to buy anything
- `/search-buy-list <item>` - Search for specific items people want to buy
  - Shows 30 items per page with pagination
  - Empty response if no matching items are found

## Categories
The bot's commands are organized into the following categories:
1. Core - Basic bot functionality
2. Essences - Everything related to essence management
3. Blocks - Block-related information and pricing
4. Selling - Commands for listing and viewing items for sale
5. Buying - Commands for listing and viewing items wanted for purchase

## Tips for Using the Bot
1. Use the `/help` command without any arguments to see all available categories
2. Use `/help <category>` to see all commands in a specific category
3. Use `/help <command>` to get detailed information about a specific command
4. The bot uses slash commands, so all commands start with `/`
5. Many commands have autocomplete functionality to help you find the right options
6. All responses are ephemeral (only visible to you) to keep channels clean
7. List viewing commands use pagination (30 items per page) for better organization
8. When adding or removing items from buy/sell lists, make sure to use positive quantities

## Note
The bot is designed to facilitate trading in the Minewind game by:
- Managing both buy and sell listings
- Tracking essence and block information
- Providing easy-to-use search and view functions
- Organizing large lists with pagination
- Helping connect buyers with sellers

Remember to use the help command if you need more specific information about any command or category!

