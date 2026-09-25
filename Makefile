.PHONY: install dev start typecheck build up down restart logs sh clean

install: ## Install dependencies
	bun install

dev: ## Run locally with hot reload
	bun run dev

start: ## Run locally without hot reload
	bun run start

typecheck: ## Type-check the project
	bun run typecheck

build: ## Build/rebuild the docker image
	docker compose build

up: ## Start the app in docker (detached)
	docker compose up -d --build

down: ## Stop and remove the docker containers
	docker compose down

restart: down up ## Restart the docker containers

logs: ## Follow docker container logs
	docker compose logs -f app

sh: ## Open a shell inside the running container
	docker compose exec app sh

clean: ## Remove containers, volumes and dangling images created by this project
	docker compose down -v --rmi local
