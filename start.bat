@ECHO OFF

:loop
node index.js 1> last.log
GOTO loop