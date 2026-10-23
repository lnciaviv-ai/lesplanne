# Mispah-Skool Lesplan + Toets Generator

’n Volledige AI-aangedrewe stelsel wat weeklikse lesplanne + gedifferensieerde toetse outomaties genereer in die presiese formaat van Mispah-Skool.

## Kenmerke

- **Hoë-gehalte AI generasie** (OpenAI GPT-4o of Grok)
- Presiese Mispah-Skool lesplan formaat
- Gedifferensieerde toets (Groep 1 Basies / Groep 2 Matig / Groep 3 Gevorderd)
- PDF aflaai + druk
- Geskiedenis van vorige lesplanne
- Gereed vir Render.com

## Vinnige Start (lokaal)

```bash
# 1. Installeer dependencies
npm install

# 2. Skep .env lêer
cp .env.example .env
# Sit jou OpenAI of Grok API key in die .env lêer

# 3. Begin die server
npm start
```

Gaan na http://localhost:3000

## Deploy op Render.com (Gratis + Premium)

### Stap-vir-stap:

1. **Gaan na** [https://render.com](https://render.com) en maak ’n rekening.

2. **New → Web Service**

3. **Connect jou GitHub repo** (of upload die kode).
   - As jy nog nie ’n repo het nie:
     ```bash
     git init
     git add .
     git commit -m "Initial commit"
     # Push na GitHub
     ```

4. **Instellings op Render:**
   - **Name**: `mispah-lesplan` (of enige naam)
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free (of Starter vir beter prestasie)

5. **Environment Variables** (belangrik!):
   Gaan na Environment → Add Environment Variable:

   | Key              | Value                          |
   |------------------|--------------------------------|
   | `OPENAI_API_KEY` | jou OpenAI sleutel (sk-...)    |
   | `MODEL`          | `gpt-4o` (of `gpt-4o-mini`)    |
   | `NODE_ENV`       | `production`                   |

   **Vir Grok (xAI):**
   | Key              | Value                          |
   |------------------|--------------------------------|
   | `XAI_API_KEY`    | jou xAI sleutel                |
   | `API_BASE_URL`   | `https://api.x.ai/v1`          |
   | `MODEL`          | `grok-beta`                    |

6. Klik **Create Web Service**.

7. Wag tot dit deploy is. Jy kry ’n URL soos:
   `https://mispah-lesplan.onrender.com`

### Belangrike notas vir Render Free Tier
- Die app “slaap” na 15 minute van inaktiwiteit (eerste request kan 30–50 sekondes neem).
- Vir beter prestasie, upgrade na **Starter** ($7/maand) – dan bly dit altyd wakker.

## API Endpoints

| Method | Endpoint              | Beskrywing                     |
|--------|-----------------------|--------------------------------|
| POST   | `/api/generate`       | Genereer lesplan + toets       |
| GET    | `/api/history`        | Lys onlangse lesplanne         |
| GET    | `/api/history/:id`    | Kry spesifieke lesplan         |
| GET    | `/api/health`         | Health check                   |

### Voorbeeld Request

```bash
curl -X POST https://jou-app.onrender.com/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "vak": "Natuurwetenskap",
    "graad": "5.1-5.3",
    "kwartaal": "2",
    "week": "7",
    "datum": "11-15/05",
    "tema": "Lae van die Aarde",
    "doelstellings": "Leerders moet die 4 lae van die Aarde ken...",
    "includeTest": true
  }'
```

## Koste

- **Render Free**: $0 (met slaap)
- **Render Starter**: ±$7/maand (altyd aan)
- **OpenAI GPT-4o-mini**: Baie goedkoop (±$0.15 per 1M tokens)
- **OpenAI GPT-4o**: Beter kwaliteit, ietwat duurder
- **Grok (xAI)**: Kontroleer x.ai pryse

## Ondersteuning

As jy hulp nodig het om te deploy of die stelsel aan te pas, stuur net ’n boodskap.
