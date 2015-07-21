# glknode
Interactive fiction NodeJS Express app with [cheapglk](https://github.com/erkyrath/cheapglk) and [glulxe](https://github.com/erkyrath/glulxe) backend, runs .ulx text adventures with POST and GET for I/O

## Building
```
cd cheapglk
make
cd ../glulxe
make
cd ..
npm install
```
## Running
```
node server.js
```
## Communicating from a remote client

To get the last output:
```
curl -X GET http://localhost:8081
```
To send a command (ex. "look at stream"):
```
curl -X POST -H "Content-Type: application/json" -d '{"command":"look at stream"}' http://localhost:8081
```
You must GET after you POST in order to see the revised output from the GLULXE engine.
