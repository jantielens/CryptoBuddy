# Full list of commands
## Hi!
To get started with the chat bot, just type `hi`, `hello` or `yo` (or any other text that is not included in the list below).
## Favorites
* `add fav`: starts the dialog to add a new favorite symbol to your list
* `show favs` or `f`: shows your favorite symbols
* `remove fav`: starts the dialog to remove a symbol from your favorites
* `remove all favs`: removes all symbols from your favorites
## Notifications
* `add notification`: starts the dialog to add a new notification for a symbol
* `show notification`: shows your active notifications
* `remove notification`: starts the dialog to remove a notification for a symbol
* Shortcut to add a conditional notification: `add` *symbol* `<` or `> ` *price* *name* . 
For example `add BTCUSD > 10000 sample notification` will create a notification when the **USD** price of **BTC** will go higher than **10000**. The name of this notification will be **sample notification**. Pay attention to the spaces!
## Orders
You need to be authenticated to access your Bitfinex orders (see Authentication below).
* `orders` or `o`: shows your active Bitfinex orders
## Wallet
You need to be authenticated to access your Bitfinex wallet (see Authentication below).
* `wallet` or `w`: shows your Bifinex wallet
## Authentication
* `auth`: starts the dialog to authenticate yourself using a Bitfinex API key and secret. See the [Bitfinex documentation](https://support.bitfinex.com/hc/en-us/articles/115002349625-API-Key-setup-and-Login) to learn how to create an API key and secret for your account. 
## General
* `stop`: cancels a dialog you have started (e.g. while adding a favorite)
* `status`: shows your current status (e.g. authenticated or not)
* `version`: shows the version of the chat bot  
* `debug`: shows usefull information for debugging the bot code
* `help`: shows a short help message and link
