run-backend-all: start-db start-backend 

start-backend: 
	cd ./backend && npm run dev 

start-db:
	cd ./backend && docker compose up -d 

stop-db:
	cd ./backend && docker compose down