#!/bin/bash

if [ "$1" != 'skipupload' ]
then
	scp ../build/carservice.tar.gz sherd@boomtararam.ru:~/boomtararam_dev.tar.gz
fi

ssh -t -t sherd@boomtararam.ru 'echo "gjhj%%kjy" | sudo -Sv && bash -s' <<-'ENDSSH'
	sudo -i -u boomtararam_dev rm -rf /home/boomtararam_dev/bundle
	sudo -i -u boomtararam_dev cp /home/sherd/boomtararam_dev.tar.gz /home/boomtararam_dev
	sudo -i -u boomtararam_dev cd /home/boomtararam_dev
	sudo -i -u boomtararam_dev tar -xzf ./boomtararam_dev.tar.gz
	sudo -i -u boomtararam_dev npm install --prefix /home/boomtararam_dev/bundle/programs/server
	sudo restart boomtararam_dev
	sudo -i -u boomtararam_site rm -rf /home/boomtararam_site/bundle
	sudo -i -u boomtararam_site cp /home/sherd/boomtararam_dev.tar.gz /home/boomtararam_site/boomtararam_site.tar.gz
	sudo -i -u boomtararam_site cd /home/boomtararam_site
	sudo -i -u boomtararam_site tar -xzf ./boomtararam_site.tar.gz
	sudo -i -u boomtararam_dev npm install --prefix /home/boomtararam_site/bundle/programs/server
	sudo restart boomtararam_site
	date
	exit
ENDSSH