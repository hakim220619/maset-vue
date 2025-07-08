docker build -t zulkarnen/maset-vue -f .docker/Dockerfile --target production .
docker push zulkarnen/maset-vue
ssh developer@103.181.182.81 "cd /home/developer/app/web/ && docker compose pull && docker compose up -d"