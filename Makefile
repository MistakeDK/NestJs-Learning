compose:
	docker compose down -v
	docker compose up -d --build

log-nest:
	docker logs nest_chat_app

build-and-push:
	docker build -t datnguyen03/chat-app:latest .
	docker push datnguyen03/chat-app:latest
