include .env

DC=docker compose

.PHONY: up down logs psql reset status

up:
	@echo "🚀 Starting Docker services..."
	$(DC) up -d --build
	@echo "⏳ Waiting for ngrok to initialize..."
	sleep 8
	@echo "🌐 Retrieving ngrok public URL..."
	@curl -s http://localhost:4040/api/tunnels | jq -r '.tunnels[0].public_url'
	
down:
	$(DC) down

logs:
	$(DC) logs -f postgres

psql:
	docker exec -it workshop-postgres psql -U $(POSTGRES_USER) -d $(POSTGRES_DB)

status:
	$(DC) ps

# ⚠️ reset deletes the volume data
reset:
	$(DC) down -v
	$(DC) up -d
