run-backend-all: start-db start-backend 

start-backend: 
	cd ./backend && npm run dev 

start-db:
	cd ./backend && docker compose up -d 

stop-db:
	cd ./backend && docker compose down

install-backend:
	cd ./backend && npm install

reset-db:
	cd ./backend && docker compose down
	sudo rm -rf ./backend/.volumes/postgres/data/*
	cd ./backend && docker compose up -d
check-db:
	docker exec -it backend-postgres-1 psql -U postgres -d atlas -c "SELECT * FROM alimentacion LIMIT 5;" -P pager=off

recreate-db:
	cd ./backend && docker compose down -v
	cd ./backend && docker compose up -d

reset-db-hard:
	cd backend && docker compose down -v
	cd backend && sudo rm -rf ./.volumes/postgres/data
	cd backend && docker compose up -d
	sleep 5