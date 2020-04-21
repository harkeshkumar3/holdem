const MAX_PLAYERS = 9;
const MIN_PLAYERS = 2;

const games = {};

function get(id) {
  const game = games[id] || null;

  if (!game) {
    throw new Error(`Game with id, ${id}, does not exist.`);
  }

  return game;
}

function newPlayer(playerId) {
  return {
    playerId,
    isReady: false,
    data: {}
  };
}

function _new({ id, playerId, emit }) {
  const game = {
    id,
    isStarted: false,
    players: {
      [playerId]: newPlayer(playerId)
    }
  };

  game.playerCount = () => Object.entries(game.players).length;
  game.canStart = () => game.playerCount() >= MIN_PLAYERS;
  game.isFull = () => game.playerCount() >= MAX_PLAYERS;
  game.shouldStart = () => game.canStart() && game.players.every(
    player => player.isReady
  );

  game.emit = () => emit('game_state_updated', {
    ...game,
    playerCount: game.playerCount(),
    canStart: game.canStart(),
    isFull: game.isFull()
  });

  games[id] = game;
  game.emit();
}

function addPlayer({ id, playerId }) {
  const game = get(id);

  if (game.isFull()) {
    throw new Error('Game is already full.');
  }

  if (game.players[playerId]) {
    throw new Error('Player already added.');
  }

  game.players[playerId] = newPlayer(playerId);
  game.emit();
}

function setPlayerData({
  id,
  playerId,
  data
}) {
  const game = get(id);

  if (!game.players[playerId]) {
    throw new Error('Player does not exist.');
  }

  game.players[playerId].data = {
    ...game.players[playerId].data,
    ...data
  };

  game.emit();
}

function setPlayerReady({
  id,
  playerId,
  value
}) {
  const game = get(id);

  if (!game.players[playerId]) {
    throw new Error('Player does not exist.');
  }

  game.players[playerId].isReady = value;

  if (game.shouldStart()) {
    game.isStarted = true;
  }

  game.emit();
}

function removePlayer() {

}

function makeMove() {

}

module.exports = {
  new: _new,
  addPlayer,
  setPlayerData,
  setPlayerReady,
  removePlayer,
  makeMove
};