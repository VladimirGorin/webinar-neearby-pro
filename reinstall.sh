#!/bin/bash

code_url="https://github.com/VladimirGorin/webinar-neearby-pro.git"

cd /var/www/html/
rm -rf ./webinar-backend && rm -rf ./webinar-front


git clone $code_url
cd webinar-neearby-pro

mv ./client webinar-front && mv ./server webinar-backend


mv webinar-front ../ && mv webinar-backend ../

cd ..

pm2 delete webinar-front && pm2 delete webinar-backend

cd webinar-backend/ && npm i && pm2 start ecosystem.config.js --name webinar-backend && pm2 save && cd ..
cd webinar-front/ && npm i && pm2 start ecosystem.config.js --name webinar-front && pm2 save && npm run build && cd ..

cd /var/www/html/ && rm -rf ./webinar-neearby-pro