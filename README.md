Initial commit; this will be a long WIP but here it is

How to start this in a way that works:
- In terminal: python -m http.server 8000
- In browser: http://localhost:8000
- To prevent code caching: Ctrl + Shift + R force refresh

>> Notes/To-Do:
-> Different rule/filling up rules when wordles become more (ain't no way someone will type 1000 words)
    -> get rid of solved riddles when they become too many
        -> delete them when there are too many ? if needed
    -> make it so that having guessed all letters in a word correctly automatically "solves" it
    -> further inspiration from 64ordle or so
-> Alphabet hints to be working
-> Definitely, absolutely remove the solutions from showing up in the log
-> check what is wrong with correct solutions? -> probably because the solutions seem to be very rare words