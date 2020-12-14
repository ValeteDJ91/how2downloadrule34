@ECHO OFF

:loop
node index.js 1>> log.log
GOTO loop