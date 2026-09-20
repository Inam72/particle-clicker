'use strict';

/** @module Multiplayer
 * Peer-to-peer play against other browsers. No server or account is
 * involved: connections are set up over public Nostr relays via Trystero
 * (see js/external/trystero-nostr-*.bundle.mjs and the module script in
 * index.html that exposes it as window.__trystero), then progress is sent
 * directly between players' browsers. Each player's save stays local; only
 * name/stat/goal/progress ever leaves the browser.
 */
var Multiplayer = (function() {
  var APP_ID = 'particle-clicker-cern-webfest';
  var BROADCAST_INTERVAL_MS = 2000;

  var room = null;
  var progressAction = null;
  var settingsAction = null;
  var intervalHandle = null;

  var isHost = false;
  var settings = null; // { statKey, goal }
  var startTime = 0;
  var selfName = '';
  var roomId = '';
  var players = {}; // peerId (or 'self') -> { name, value, finishedAt, isSelf }
  var getValue = function() { return 0; };
  var onUpdate = function() {};

  var makeRoomId = function() {
    return Math.random().toString(36).slice(2, 8).toUpperCase();
  };

  var broadcast = function() {
    if (!settings) {
      return;
    }
    var value = getValue();
    var finishedAt = players.self && players.self.finishedAt;
    if (!finishedAt && settings.goal && value >= settings.goal) {
      finishedAt = new Date().getTime() - startTime;
    }
    players.self = { name: selfName, value: value, finishedAt: finishedAt, isSelf: true };
    progressAction.send({ name: selfName, value: value, finishedAt: finishedAt });
    onUpdate();
  };

  var setup = function(code, name, valueGetter) {
    roomId = code;
    selfName = name;
    getValue = valueGetter;
    startTime = new Date().getTime();
    players = {};

    room = window.__trystero.joinRoom({ appId: APP_ID }, roomId);

    progressAction = room.makeAction('progress');
    progressAction.onMessage = function(data, meta) {
      players[meta.peerId] = {
        name: data.name,
        value: data.value,
        finishedAt: data.finishedAt,
        isSelf: false
      };
      onUpdate();
    };

    settingsAction = room.makeAction('settings');
    settingsAction.onMessage = function(data) {
      if (!isHost) {
        settings = data;
        broadcast();
      }
    };

    room.onPeerJoin = function(peerId) {
      if (isHost) {
        settingsAction.send(settings, { target: peerId });
      }
    };
    room.onPeerLeave = function(peerId) {
      delete players[peerId];
      onUpdate();
    };

    intervalHandle = window.setInterval(broadcast, BROADCAST_INTERVAL_MS);
  };

  var create = function(name, statKey, goal, valueGetter) {
    isHost = true;
    settings = { statKey: statKey, goal: goal || null };
    setup(makeRoomId(), name, valueGetter);
    broadcast();
  };

  var join = function(name, code, valueGetter) {
    isHost = false;
    settings = null;
    setup(code, name, valueGetter);
  };

  var leave = function() {
    if (intervalHandle) {
      window.clearInterval(intervalHandle);
      intervalHandle = null;
    }
    if (room) {
      room.leave();
      room = null;
    }
    isHost = false;
    settings = null;
    players = {};
    roomId = '';
  };

  var getPlayers = function() {
    var list = [];
    for (var id in players) {
      list.push(players[id]);
    }
    list.sort(function(a, b) {
      if (!!a.finishedAt !== !!b.finishedAt) {
        return a.finishedAt ? -1 : 1;
      }
      if (a.finishedAt && b.finishedAt) {
        return a.finishedAt - b.finishedAt;
      }
      return b.value - a.value;
    });
    return list;
  };

  return {
    create: create,
    join: join,
    leave: leave,
    getPlayers: getPlayers,
    getSettings: function() { return settings; },
    getRoomId: function() { return roomId; },
    isInRoom: function() { return !!room; },
    setOnUpdate: function(fn) { onUpdate = fn; }
  };
})();
