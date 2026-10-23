const OpenAI = require('openai');

// Supports OpenAI, Grok (xAI), or any OpenAI-compatible API
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.XAI_API_KEY || process.env.API_KEY,
  baseURL: process.env.API_BASE_URL || undefined // e.g. https://api.x.ai/v1 for Grok
});

const SYSTEM_PROMPT = `Jy is ’n ervare onderwyser en kurrikulum-spesialis by Mispah-Skool (spesiale onderwys / multi-vlak klasse in Suid-Afrika). 

Jou taak is om hoë-gehalte, praktiese en realistiese weeklikse lesplanne + gedifferensieerde assesserings te skep.

BELANGRIKE REËLS:
1. Alles moet in natuurlike, korrekte Afrikaans wees.
2. Die formaat moet PRESIS ooreenstem met die skool se bestaande template.
3. Aktiwiteite moet hands-on, realisties en geskik wees vir leerders met verskillende vermoëns.
4. Differensiasie is krities:
   - Graad 5.1 / 4.1 = Baie basies, baie visuele ondersteuning, matching, benoem, kleur
   - Graad 5.2 / 4.2 = Matig, tabelle, eenvoudige verduidelikings, meer selfstandigheid
   - Graad 5.3 = Gevorderd, wetenskaplike metode, evaluering, toepassings, volsinne
5. Die toets moet dieselfde styl hê as goeie informele assesserings: Groep 1 (basies + woordbank + matching/kleur), Groep 2 (kort vrae), Groep 3 (gevorderd).
6. Moenie generiese inhoud gee nie – maak dit spesifiek vir die tema en doelstellings.
7. Gebruik die presiese opskrifte: Konsep onderwys/ groepwerk, Leerwerk wat uitgelig word vir die week, Konsepte, Praktiese Aktiwiteite, Integrasie, Formele/informele assessering, Onderwysers intervensie, Hulpmiddels/AT, HOD KOMMENTAAR, ens.`;

async function generateLessonPlan(data) {
  const {
    vak = 'Natuurwetenskap',
    graad = '5.1-5.3',
    kwartaal = '2',
    week = '7',
    datum = '',
    tema = '',
    doelstellings = '',
    includeTest = true
  } = data;

  const userPrompt = `
Skep ’n volledige weeklikse lesplan${includeTest ? ' + gedifferensieerde informele assessering' : ''} vir Mispah-Skool.

=== INVOER ===
Vak: ${vak}
Graad-reeks: ${graad}
Kwartaal: ${kwartaal}
Week: ${week}
Datum: ${datum || 'Nie gespesifiseer'}
Tema: ${tema}

Doelstellings / Leerwerk wat uitgelig moet word:
${doelstellings}

=== VERWAGTE UITSET FORMAAT (JSON) ===
Antwoord SLEGS met geldige JSON in hierdie struktuur (geen ekstra teks voor of na):

{
  "lesplan": {
    "header": {
      "vak": "${vak}",
      "graad": "${graad}",
      "jaar": "2026",
      "kwartaal": "${kwartaal}",
      "week": "${week}",
      "datum": "${datum}",
      "tema": "${tema}"
    },
    "leerwerk": ["punt 1", "punt 2", "punt 3", "punt 4"],
    "konsepte": ["konsep 1", "konsep 2", "konsep 3", "konsep 4"],
    "praktieseAktiwiteite": {
      "graad1": {
        "titel": "Graad 5.1 – Basies" of "Graad 4.1 – Baie basies",
        "aktiwiteite": ["aktiwiteit 1", "aktiwiteit 2", "aktiwiteit 3"]
      },
      "graad2": {
        "titel": "Graad 5.2 – Matig" of "Graad 4.2 – Matig",
        "aktiwiteite": ["aktiwiteit 1", "aktiwiteit 2", "aktiwiteit 3"]
      },
      "graad3": {
        "titel": "Graad 5.3 – Gevorderd",
        "aktiwiteite": ["aktiwiteit 1", "aktiwiteit 2", "aktiwiteit 3"]
      }
    },
    "integrasie": ["Wiskunde (...)", "Taal (...)", "Lewensoriëntering (...)"],
    "assessering": ["Informeel: ...", "Gedifferensieerde toets (sien aangeheg)"],
    "intervensie": ["Visuele ondersteuning...", "Sterk leerders paar op...", "Stap-vir-stap..."],
    "hulpmiddels": "Lys van benodigde materiale..."
  }${includeTest ? `,
  "toets": {
    "titel": "Informele Assessering",
    "totaal": 15,
    "groep1": {
      "titel": "Groep 1 (Basies) – 5 punte",
      "instruksies": ["Skryf jou naam...", "Kyk na die prent...", "..."],
      "woordbank": ["Woord1", "Woord2", "Woord3", "Woord4"],
      "take": ["Benoem die dele op die lyne...", "Kleur of koppel die regte antwoord..."],
      "matchingVoorbeelde": ["Item A → ...", "Item B → ..."]
    },
    "groep2": {
      "titel": "Groep 2 (Matig) – 5 punte",
      "instruksies": "Lees elke vraag versigtig...",
      "vrae": [
        {"nommer": 1, "vraag": "Vraag teks?", "punte": 1},
        {"nommer": 2, "vraag": "Vraag teks?", "punte": 1}
      ]
    },
    "groep3": {
      "titel": "Groep 3 (Gevorderd) – 5 punte",
      "instruksies": "Beantwoord in volsinne...",
      "vrae": [
        {"nommer": 1, "vraag": "Vraag teks?", "punte": 2},
        {"nommer": 2, "vraag": "Vraag teks?", "punte": 2}
      ]
    },
    "rubriek": {
      "kriteria": [
        {"naam": "Benoem / Matching", "vlakke": ["0-1 korrek", "2 korrek", "Almal korrek"]},
        {"naam": "Kleur / Koppel", "vlakke": ["Min korrek", "Meeste korrek", "Alles korrek"]},
        {"naam": "Netheid", "vlakke": ["Baie slordig", "Redelik netjies", "Netjies"]}
      ]
    }
  }` : ''}
}

Maak die inhoud spesifiek, prakties en van hoë gehalte. Die praktiese aktiwiteite en toetsvrae moet direk uit die doelstellings vloei.
`;

  try {
    const completion = await openai.chat.completions.create({
      model: process.env.MODEL || 'gpt-4o', // or 'grok-beta' / 'grok-2' etc.
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 4000,
      response_format: { type: 'json_object' }
    });

    const content = completion.choices[0].message.content;
    const parsed = JSON.parse(content);
    return parsed;

  } catch (error) {
    console.error('AI Generation failed:', error.message);
    
    // Fallback: return a structured template so the app still works
    return createFallbackPlan(data);
  }
}

function createFallbackPlan(data) {
  const { vak, graad, kwartaal, week, datum, tema, doelstellings, includeTest } = data;
  const isGrade5 = graad.includes('5');

  return {
    lesplan: {
      header: { vak, graad, jaar: '2026', kwartaal, week, datum, tema },
      leerwerk: [
        `Die kernbegrippe van ${tema} verstaan.`,
        `Praktiese vaardighede rakende ${tema} demonstreer.`,
        `Kennis van ${tema} in alledaagse situasies kan toepas.`,
        `Belangrike terminologie korrek gebruik.`
      ],
      konsepte: [
        `Kernkonsepte van ${tema}`,
        'Wetenskaplike metode / praktiese toepassing',
        'Eienskappe en gebruike',
        'Veiligheid en verantwoordelike gebruik'
      ],
      praktieseAktiwiteite: {
        graad1: {
          titel: isGrade5 ? 'Graad 5.1 – Basies' : 'Graad 4.1 – Baie basies',
          aktiwiteite: [
            `Eenvoudige identifikasie- en matching-aktiwiteit met prente of werklike items oor ${tema}.`,
            'Onderwyser-geleide demonstrasie of groepaktiwiteit (baie visuele ondersteuning).',
            'Basiese waarneming of sorteringstaak.'
          ]
        },
        graad2: {
          titel: isGrade5 ? 'Graad 5.2 – Matig' : 'Graad 4.2 – Matig',
          aktiwiteite: [
            `Maak ’n eenvoudige tabel of vergelyking oor ${tema}.`,
            'Praktiese aktiwiteit met meer selfstandigheid.',
            'Kort verduideliking of bespreking in eie woorde.'
          ]
        },
        graad3: {
          titel: 'Graad 5.3 – Gevorderd',
          aktiwiteite: [
            'Meer komplekse praktiese taak of volledige proses (hipotese → resultate → gevolgtrekking).',
            'Ontwerp, evalueer of skep iets (tabel, grafiek, pamflet of verslag).',
            'Verduidelik die konsep in eie woorde en pas dit toe.'
          ]
        }
      },
      integrasie: ['Wiskunde (tabelle / metings)', 'Taal (terminologie)', 'Lewensoriëntering (daaglikse lewe)'],
      assessering: ['Informeel: Waarneming tydens aktiwiteite', 'Gedifferensieerde toets (sien aangeheg)'],
      intervensie: ['Visuele ondersteuning en eenvoudige taal', 'Sterk leerders paar op met swakker leerders', 'Stap-vir-stap begeleiding'],
      hulpmiddels: `Prente, werklike voorwerpe, werkblaaie, visuele hulpmiddels, materiale vir ${tema}.`
    },
    toets: includeTest ? {
      titel: 'Informele Assessering',
      totaal: 15,
      groep1: {
        titel: 'Groep 1 (Basies) – 5 punte',
        instruksies: [
          'Skryf jou naam en datum bo-aan die blad.',
          'Kyk na die prent / diagram.',
          'Benoem die belangrikste dele. Gebruik die woorde in die blokkie.',
          'Kleur of koppel waar nodig.'
        ],
        woordbank: ['Konsep 1', 'Konsep 2', 'Konsep 3', 'Konsep 4'],
        take: [
          'Benoem die dele / konsepte op die lyne of in die blokkies. (3)',
          'Kleur of koppel die regte antwoord. (2)'
        ],
        matchingVoorbeelde: ['Item A → ________', 'Item B → ________', 'Item C → ________']
      },
      groep2: {
        titel: 'Groep 2 (Matig) – 5 punte',
        instruksies: 'Lees elke vraag versigtig en beantwoord netjies.',
        vrae: [
          { nommer: 1, vraag: `Wat is die belangrikste ding wat jy oor ${tema} geleer het?`, punte: 1 },
          { nommer: 2, vraag: `Noem twee feite oor ${tema}.`, punte: 2 },
          { nommer: 3, vraag: `Gee ’n voorbeeld van ${tema} in die alledaagse lewe.`, punte: 1 },
          { nommer: 4, vraag: `Verduidelik kortliks waarom ${tema} belangrik is.`, punte: 1 }
        ]
      },
      groep3: {
        titel: 'Groep 3 (Gevorderd) – 5 punte',
        instruksies: 'Beantwoord die vrae in volsinne. Wys jou begrip.',
        vrae: [
          { nommer: 1, vraag: `Verduidelik in jou eie woorde wat ${tema} is en waarom dit belangrik is.`, punte: 2 },
          { nommer: 2, vraag: `Vergelyk twee aspekte van ${tema}. Wat is die verskil?`, punte: 2 },
          { nommer: 3, vraag: `Hoe kan jy die kennis van ${tema} in die alledaagse lewe gebruik? Gee ’n voorbeeld.`, punte: 1 }
        ]
      },
      rubriek: {
        kriteria: [
          { naam: 'Benoem / Matching', vlakke: ['0-1 korrek', '2 korrek', 'Almal korrek'] },
          { naam: 'Kleur / Koppel', vlakke: ['Min korrek', 'Meeste korrek', 'Alles korrek'] },
          { naam: 'Netheid', vlakke: ['Baie slordig', 'Redelik netjies', 'Netjies'] }
        ]
      }
    } : null
  };
}

module.exports = { generateLessonPlan };
