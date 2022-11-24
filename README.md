# docker-compose-js-mongo

## Задание 7. Использование Docker с БД:
 
Для запуска ввести команды: 

docker-compose build

docker-compose up

## Задание 8. Проектирование процесса CI/CD для веб-приложения



## Задание 9. Кластеризация

### Команды для запуска кластеризации в docker swarm

docker swarm init //запускаем докер-улей

docker service create --name registry --replicas 4 --publish published=4005,target=4005 registry:2 //создаем сервис с 4 репликами

docker service ls //проверка

docker-compose push //отправляем образы

docker stack deploy --compose-file docker-compose.yml stackdemo //деплой

docker ps //проверка

### Команды для удаления созданного в docker swarm

docker stack rm stackdemo //удаление деплоя

docker service rm registry //удаление сервиса

docker service ls //проверка

docker swarm leave --force //полный выход из докер-улья

### Скрипт Dockerfile

```
FROM node:18.10-alpine3.15
WORKDIR /app
COPY package.json .
RUN yarn
COPY . .
EXPOSE 4000
CMD node server.js
```

### Скрипт docker-compose.yml

```
version: '2'
services:
  app:
    container_name: app
    image: 127.0.0.1:4005/stackdemo
    restart: always
    build: .
    ports:
      - '4000:4000'
    links:
      - mongo
    deploy:
      mode: replicated
      replicas: 4
  mongo:
    container_name: mongo
    image: mongo
    ports:
      - '27017:27017'
```

### Каким образом можно проанализировать требования к количеству кластеров приложения? Как бы вы решили задачу такой оценки?

Количество кластеров определяет следующие характеристики приложения:

cost efficiency - энергозатраты

resilence - устойчивость

ease of management - легкость в управлении

application security - безопасность приложения

Влияние количества кластеров на данные характеристики можно увидеть в таблице ниже

<imgsrc="https://user-images.githubusercontent.com/47847427/203816212-9edfdc86-7b6c-4439-b613-e3c93656673d.png" width="600">

Чем больше кластеров, тем приложение более устойчиво к поломкам и в нем выше безопасность, но при этом увеличиваются энергозатраты и повышается сложность управления этими кластерами.

Чем меньше кластеров, тем приложение менее энергозатратно и сложно в управлении, но также менее устойчиво к поломкам и угрозам безопасности.

При выборе количества кластеров следует исходить прежде всего из того, что действительно нужно, жертвуя определенными параметрами приложения.
