# backend
<pre>
1) mysql
docker run -d --rm --name mysql \
    -e MYSQL_ROOT_PASSWORD=root \
    -e MYSQL_DATABASE=mapping_db  \
    -p 3306:3306 \
    mysql:8

2) redis
docker run -d --rm --name redis \
    -p 6379:6379 \
    redis:alpine

3) new project
nest new backend
✔ Which package manager would you ❤️ to use? npm

4) install
cd backend
npm install @nestjs/typeorm mysql2
npm install class-validator
npm install ioredis redlock
npm install uuid

5) resource
nest generate resource mappings
✔ What transport layer do you use? REST API
✔ Would you like to generate CRUD entry points? Yes

6) modify
src/app.module.ts

src/mappings/entities/mapping.entity.ts
src/mappings/dto/create-mapping.dto.ts

src/mappings/mappings.module.ts
src/mappings/mappings.controller.ts
src/mappings/mappings.service.ts

7) start
npm run start

8) curl
curl -X POST http://localhost:3000/mappings \
  -H "Content-Type: application/json" \
  -d '{"id1": "user_123", "id2": "profile_456"}'

9) sequence diagram
on MacOS: brew install graphviz
npx madge dist/main.js --image diagram.png
</pre>
