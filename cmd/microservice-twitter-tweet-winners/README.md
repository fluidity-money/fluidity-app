
# Microservice Twitter Tweet Winners

Gets winners off the queue, finds the user action associated with it,
gets the amount that was sent/used, identifies the application that is
in use using Arbiscan after getting the contract size, then tweets the
hashtag associated with that project with a link to the webapp and the
transaction hash.

Only tweets if the sender is the winner (this is done to prevent doubling up).

The following is tweeted if the other side is a contract:

	"0x111...998" was rewarded X USDC with #fluidity for using
	#uniswap! Learn more here https://fluidity.money #arbitrum

The following is tweeted if there was an ordinary send:

	"0x111...998" received X USDC with #fluidity for sending to
	"0x111...999" #fUSDC is a pegged 1-to-1 asset that can
	be redeemed at any time at no cost.
	#arbitrum
