compose:
	docker compose down -v
	docker compose up -d --build

log-nest:
	docker logs nest_chat_app