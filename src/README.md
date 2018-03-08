# **Welcome to the SquadSpinner API guide!**
__  __
### Preface:
Requests first pass through the `express-rate-limiter`.
Every route except for **/signup** must be authenticated with `Passport` and `JWT` to get passed on to its handler thanks to `express`'s `next()` callback.
Errors should utilize the `done()` callback to respond with an understandable success/fail message.

The main goal for this application is to query the DB as little as possible.
Since were using `Socket.io`, we can broadcast DB changes to all users in a lobby as they happen.
This way, every joined user in a lobby can let their component's state be manipulated by `Socket.io` events.
__  __
# User API:

### POST '/login'
* __Requirements:__ None
* __Request Body:__
`{ "email": "example@example.com",`
`"password": "plaintext" }`

### POST '/signup'
* __Requirements:__ None
* __Request Body:__
`{ "email": "example@example.com",`
`"userName": "plaintext" ,`
`"password": "plaintext" }`

### POST '/getUser'
* __Requirements:__ Token stored in authorization header containing user object
* __Request Body:__ None

### PUT '/editUser/:user_id'
* __Requirements:__ Token stored in authorization header containing userId identical to URL parameter supplied userId
* __Note:__ User may only change userName
* __Request Body:__
`{ "email": "example@example.com",`
`"userName": "Spicyb0i" }`

__ __
# Lobby API:

### GET '/getLobby/:shortId'
* __Requirements:__ Valid user token stored in authorization header
* __Request Body:__ None

### POST '/createLobby'
* __Requirements:__ Valid user token stored in authorization header
* __Request Body:__
`{ "lobbyName": "Lizard People",`
`"settings": {`
`"voteToSkip": { "voteToSkipEnabled": true, "requiredVotesToSkip": 2 },`
`"hideVideoPlayer": false`
`}`
`}`

### PUT '/updateLobbySettings/:lobby_id'
* __Requirements:__ Token stored in authorization header containing userId must be identical to the lobby's ownerId (lobby.users.ownerId)
* __Request Body:__
`{ "lobbyName": "Lizard People",`
`"settings": {`
`"voteToSkip": { "voteToSkipEnabled": true, "requiredVotesToSkip": 2 },`
`"hideVideoPlayer": false`
`}`
`}`

### DELETE '/deleteLobby/:lobby_id'
* __Requirements:__ Token stored in authorization header containing userId must be identical to lobby.users.ownerId
* __Request Body:__ None

### GET '/removeSong/:song_id/fromLobby/:lobby_id'
* __Requirements:__ Token stored in authorization header containing userId must be identical to lobby.users.ownerId
* __Notes:__ Only the lobby owner may remove a song from the queue
* __Request Body:__ None

__ __
# User & Lobby API:

### GET '/joinLobby/:lobby_id'
* __Requirements:__ UserId from token in header must not exist in the bannedUsers or joined array of lobby being queried
* __Notes:__ This adds the user to the queried lobby.users.joined as well as adding the lobbyId to the user.joinedLobbies
* __Request Body:__ None

### PUT '/queueSong/:lobby_id'
* __Requirements:__ UserId from token in header must exist in the joined users or ownerId of lobby being queried
* __Request Body:__
`{ "songTitle": "Metallica - Fade To Black",`
`"songUrl": "https://www.youtube.com/watch?v=WEQnzs8wl6E",`
`"provider": "youtube"`
`"addedByUser": {`
`"_id": "",`
`"userName": ""`
`}`
`}`

### GET '/leaveLobby/:lobby_id'
* __Requirements:__ Token stored in authorization header containing user object
* __Notes:__ The owner of a lobby cannot leave a lobby until it is deleted
* __Request Body:__ None

### GET '/banUser/:user_id/fromLobby/:lobby_id'
* __Requirements:__
  * UserId from token in header must match the queried lobby's owner
  * User must exist in lobby.users.joined to get banned

* __Notes:__ The owner of a lobby cannot leave a lobby until it is deleted.
* __Request Body:__ None

### GET '/ubanUser/:user_id/fromLobby/:lobby_id'
* __Requirements:__
  * UserId from token in header must match the queried lobby's owner
  * User must exist in lobby.users.bannedUsers to get unbanned

* __Notes:__ The owner of a lobby cannot leave a lobby until it is deleted.
* __Request Body:__ None
