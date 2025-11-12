include .env

DC=docker compose

.PHONY: up down logs psql reset status

up:
	@echo "🚀 Starting Docker services..."
	$(DC) up -d --build
	@echo "✅ Services started successfully!"
	@echo "🔌 MCP Server: http://localhost:4000"
	@echo "⚙️  Backend API: http://localhost:3001"
	@echo "🌐 AWS MCP URL: https://fsvdcoej2h.execute-api.us-east-1.amazonaws.com/dev/mcp"
	
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
