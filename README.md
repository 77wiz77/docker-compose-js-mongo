# docker-compose-js-mongo
# Навигация

- [Задание 7. Использование Docker с БД:](#задание-7-использование-docker-с-бд)
- [Задание 8. Проектирование процесса CI/CD для веб-приложения](#задание-8-проектирование-процесса-cicd-для-веб-приложения)
- [Задание 9. Кластеризация](#задание-9-кластеризация)

## Задание 7. Использование Docker с БД

### Dockerfile

```
FROM node:18.10-alpine3.15
WORKDIR /app
COPY package.json .
RUN yarn
COPY . .
EXPOSE 4000
CMD node server.js
```

### docker-compose.yml

```
services:
  app:
    container_name: app
    restart: always
    build: .
    ports:
      - '4000:4000'
    links:
      - mongo
  mongo:
    container_name: mongo
    image: mongo
    ports:
      - '27017:27017'
```

### Доступные URL:

/ - вывести текущее значение счетчика

/stat - текущее значение счетчика + 1

/about - Hello, 77wiz77
 
### Для запуска ввести команды: 

docker-compose build

docker-compose up

## Задание 8. Проектирование процесса CI/CD для веб-приложения

### 1 Подборка собственного набора для развертывания и тестирования приложения (marketplace действий (actions) и сценариев (workflows))

1.1 Ссылка на сценарий для создания и тестирования стека с несколькими контейнерами с использованием docker-compose:

<a href="https://github.com/peter-evans/docker-compose-actions-workflow">https://github.com/peter-evans/docker-compose-actions-workflow</a>

1.2 Ссылка на сценарий для деплоя стека с несколькими контейнерами (docker-compose) на виртуальном хостинге: 

<a href="https://github.com/marketplace/actions/docker-compose-remote-deployment">https://github.com/marketplace/actions/docker-compose-remote-deployment</a>

### 2 Реализация CI/CD (тестирование) на сервере

#### Скрипт для тестирования развертывания приложения внутри докер-контейнеров (docker-compose)

```
name: Docker Compose Actions Workflow
on: push
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Build the stack
        run: docker-compose build
      - name: Up the stack
        run: docker-compose up -d
      - name: Test
        run: docker run --network container:app appropriate/curl -s --retry 10 --retry-connrefused http://localhost:4000/
```

### 3 при каких условиях и на каком этапе процесс сборки приложения должен быть остановлен (в какой момент должны запускаться тесты) и проанализируйте как результат выполнения тестов может быть проверен.

Решение о прекращении тестирования обычно зависит от времени (которое есть в распоряжении), бюджета и необходимой продолжительности тестирования.

Чаще всего решение завершить тестирование принимается, когда закончилось время/бюджет, или же когда все тестовые сценарии выполнены. Но это компромиссное решение, которое может быть в ущерб качеству.

Результат выполнения тестов можно считать завершенным если:

<ol>
  <li>Все 100% требований учтены.</li>
  <li>Дефекты установлены/ожидаемое число дефектов обнаружено.</li>
  <li>Все дефекты, относящиеся к классу Show Stopper или Blocker, устранены, ни у одного из критических дефектов нет статуса «открытый.</li>
  <li>Все дефекты с высоким приоритетом идентифицированы и исправлены.</li>
  <li>Очень небольшое число дефектов среднего уровня критичности «открыты», их разбор проведен.</li>
  <li>Число «открытых» дефектов среднего уровня, которые не влияют на пользование системой, очень небольшое.</li>
  <li>Все дефекты с высоким уровнем приоритета закрыты и соответствующие регрессивные сценарии успешно проведены.</li>
</ol>

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
version: '3'
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

### Команды для аналогичного запуска в Kubernetes

Проверить установлен ли kubernetes:

```
kubectl version --client -o yaml
```

Запуск kubernetes:

```
minikube start
```

Создаем кластеры:

```
kubectl apply -f kubernetes.yaml
kubectl get deploy
kubectl get rs
kubectl get po
```

Создаем сервис и запускаем его локально на порту 80:

```
kubectl expose deploy kbs-example --port=80
kubectl get svc
```

Удаление созданного кластера:

```
kubectl delete deploy kbs-example
kubectl delete svc kbs-example
kubectl delete po kbs-example
```

### Скрипт kubernetes.yaml

```
apiVersion: apps/v1
kind: Deployment
metadata:
  creationTimestamp: null
  labels:
    app: kbs-example
  name: kbs-example
spec:
  replicas: 4
  selector:
    matchLabels:
      app: kbs-example
  strategy: {}
  template:
    metadata:
      creationTimestamp: null
      labels:
        app: kbs-example
    spec:
      containers:
      - image: kbs-example
        name: kbs-example
        resources: {}
status: {}
```

### Каким образом можно проанализировать требования к количеству кластеров приложения? Как бы вы решили задачу такой оценки?

Количество кластеров определяет следующие характеристики приложения:

cost efficiency - энергозатраты

resilence - устойчивость

ease of management - легкость в управлении

application security - безопасность приложения

Влияние количества кластеров на данные характеристики можно увидеть в таблице ниже

<img src="https://learnk8s.io/a/eb8d3a97d16f6c490c23fa25f20c7c0f.svg" width="600"/>

Чем больше кластеров, тем приложение более устойчиво к поломкам и в нем выше безопасность, но при этом увеличиваются энергозатраты и повышается сложность управления этими кластерами.

Чем меньше кластеров, тем приложение менее энергозатратно и сложно в управлении, но также менее устойчиво к поломкам и угрозам безопасности.

При выборе количества кластеров следует исходить прежде всего из того, что действительно нужно, жертвуя определенными параметрами приложения.
