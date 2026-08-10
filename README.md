# Bokrecensions API med Fastify och MongoDB
Ett RESTful API byggt med Fastify och MongoDb för en bokrecensionsplattform. Webbtjänsten hanterar användare 
och bokrecensioner som stöds av full CRUD-funktionalitet (Create, Read, Update, Delete). Data skyddas av JWT 
och inloggad användare kan för att lägga till inlägg samt ändra och radera sina befintliga bokrecensioner. 
Boksökningen i frontend-applikationen sker med Google Books API, för att hitta böcker och lägga till recensioner.

## Verktyg
* **Node.js** (ESM)
* **Fastify** - Ramverk
* **MongoDB** - Databas
* **mongoose** - Anslutning till MongoDb och schemavalidering
* **JWT-autentisering**
* **bcrypt** - Hashning av lösenord
* **cors** - Hanterar åtkomst av HTTP-anrop

## Installation
1. **Klona Repo**
```bash     
git clone https://github.com/rare2400/bokprojekt-backend.git
```
2. **Installera beroenden:**
```bash     
npm install
```

3. **Skapa `.env`-fil i rotmappen och fyll i databasuppgifter:**

| Variabel        | Beskrivning                     |
|-----------------|---------------------------------|
| `PORT=`         | Porten servern lyssnar på       |
| `DATABASE_URL=` | Anslutningssträng till MongoDB  |
| `JWT_SECRET=`   | Hemlig JWT-nyckel               |

4. **Starta server**
```bash
npm run dev
```

## Projektstruktur
```
bokprojekt-backend/
│
├── src/
│   ├── controllers/
│   │   ├── authController.js
│   │   └── reviewController.js
│   ├── config/
│   │   └── db.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── reviewRoutes.js
│   ├── models/
│   │   ├── User.js
│   │   └── Review.js
│   ├── app.js
│   └── server.js
├── .env
└── package.json
```

## API Endpoints
### Auth

| Metod    | Endpoint            | Skyddad | Beskrivning
| -------- | --------------------|---------|------------------------------------ |
| POST     | /auth/register      | Nej     | Registrera ny användare             |
| POST     | /auth/login         | Nej     | Logga in användare                  |

## Produkter

| Metod  | Endpoint              | Skyddad | Beskrivning                      |
|--------|-----------------------|---------|----------------------------------|
| POST   | /reviews              | Ja      | Skapa recension                  |
| GET    | /reviews?bookId=xxx   | Nej     | Hämtar recensioner för en bok    |
| GET    | /reviews/user/:userId | Nej     | Hämtar en användares recensioner |
| PUT    | /reviews/:id          | Ja      | Uppdaterar egen recension        |
| DELETE | /reviews/:id          | Ja      | Tar bort egen recension          |

**Registrera användare**

```json
POST /auth/register
{
    "username": "Eva",
    "email": "test@test.se",
    "password": "123456"
}
```

**Bokrecension**

```json
GET /reviews?bookId=zyTCAlFPjgYC
  {
    "_id": "6a59209f1b6c89e93a494e6f",
    "bookId": "zyTCAlFPjgYC",
    "userId": {
      "_id": "6a59201e087c39c7c818d1b9",
      "username": "ramona"
    },
    "rating": 5,
    "createdAt": "2026-07-16T18:19:11.374Z",
    "updatedAt": "2026-07-16T18:19:11.374Z"
  }
```

## Testning
API:t kan testas med program som:
- Thunder Client (vsc extension)
- Postman
- Advanced REST Client

## Skapad av
Skapad som en del av en skoluppgift   
Mittuniversitetet, Webbutvecklingsprogrammet    
Ramona Reinholdz   
[rare2400@student.miun.se](rare2400@student.miun.se)      
2026-08-10
