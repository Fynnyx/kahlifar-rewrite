#!bin/bash

STARTFOLDERS=("KahlifarBot" "KahlifarModeration")
WORKINGFOLDER=$( cd -- "$( dirname --  "${BASH_SOURCE[0]}" )" &> /dev/null && pwd)

bold=$(tput bold)
normal=$(tput sgr0)

printf "\nXxXxX[ Custom ]XxXxX\n"

for BOTFOLDER in "${STARTFOLDERS[@]}"
do 
	if [ -d "$WORKINGFOLDER/$BOTFOLDER" ];
	then
		cd "$WORKINGFOLDER/$BOTFOLDER"
		echo "${bold}$BOTFOLDER${normal}"
		echo "[Info] - Stopping the session ..."
		screen -X -S ${BOTFOLDER,,} kill
		echo "[Info] - Installing missing packages ..."
		npm install
		echo "[Info] - Starting bot ..."
		screen -d -m -S ${BOTFOLDER,,} bash -c "node index.js"
		echo "${bold}[Info] - Started $BOTFOLDER${normal}"
    fi
done
