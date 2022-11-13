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
		pm2 delete ${BOTFOLDER,,}
		echo "[Info] - Installing missing packages ..."
		npm install
		echo "[Info] - Starting bot ..."
		pm2 start index.js ${BOTFOLDER,,}
		echo "${bold}[Info] - Started $BOTFOLDER${normal}"
    fi
done
