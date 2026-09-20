# Particle Clicker

An addictive incremental game that teaches players the history of high energy particle physics.

Developed during the 2014 CERN Webfest over a weekend.

Visit [http://cern.ch/particle-clicker](http://cern.ch/particle-clicker) to play the game.

## Running locally

There's no build step — it's plain HTML/CSS/JS. Serve the folder with any
static file server and open it in a browser, e.g.:

```
python -m http.server 8000
```

then visit `http://localhost:8000`. Opening `index.html` directly from disk
(a `file://` URL) will not work, since the browser blocks the local JSON
data files from loading that way.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## Multiplayer

Players can create or join a room to play against each other: either racing
to be the first to reach a target amount of a chosen stat (reputation, data
collected, funding collected, or clicks), or with no target set, just
comparing that stat on a live leaderboard.

There is no server and no account of any kind, on either end. Each player's
save stays in their own browser's local storage exactly as before; only
their name, chosen stat, goal, and current progress are ever sent to other
players, directly, peer-to-peer over WebRTC. Connections are set up with
[Trystero](https://github.com/dmotz/trystero) using its `nostr` strategy,
which uses public [Nostr](https://nostr.com/) relays to exchange the initial
connection handshake (`js/multiplayer.js`) — there is nothing to configure,
run, or pay for to make this work, on Netlify or any other static host.

Because nothing is stored anywhere except in the browsers that are
currently playing, a room only exists for as long as at least one of its
players has it open — there's no way to check a room's leaderboard after
everyone has left, and a player who's behind a particularly restrictive
NAT/firewall may occasionally be unable to connect directly to peers (there
is no TURN relay server configured as a fallback, since that isn't free to
run).

The vendored `js/external/trystero-nostr-*.bundle.mjs` is Trystero's
`nostr` entry point (`trystero/nostr`, which re-exports
`@trystero-p2p/nostr`) fetched pre-bundled from
`https://esm.sh/trystero@<version>/nostr?bundle` — that's the version to
re-fetch from when upgrading it, rather than the plain npm package, since
Trystero is published as ES modules with dependencies that a browser can't
resolve on its own.
