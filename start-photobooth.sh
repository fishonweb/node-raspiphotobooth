#!/bin/bash

# photobooth start script
#run server
xterm -title "server" -hold -e "node server.js" &

#run app
xterm -title "app" -hold -e "node app.js"  &

#run firefox
xterm -title "browser" -hold -e "iceweasel http://localhost:3000"
