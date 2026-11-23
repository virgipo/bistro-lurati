# Bistró Lurati · Porlezza — sito web

Sito statico (HTML + CSS + JS, nessuna dipendenza) per il Bistró Lurati (Macellai dal 1927), Via Giuseppe Garibaldi 10, Porlezza (CO).

## Struttura
- `index.html`: tutte le sezioni (Storia, La carne, Menù, Vegetariano, Il locale, Recensioni, Contatti)
- `css/style.css`: stile (palette e font in cima al file)
- `js/main.js`: menu mobile, animazioni, selettore frollatura, filtro menù
- `assets/img/`: foto (vedi `assets/img/LEGGIMI.md` per i nomi dei file)
- `render.yaml`: configurazione per Render (static site)

## Anteprima locale
```bash
python3 -m http.server 8000
```
poi apri http://localhost:8000

## Pubblicazione su Render
1. Carica questa cartella su un repository GitHub.
2. Su Render: **New → Blueprint** (usa `render.yaml`) oppure **New → Static Site**, publish directory `.`, build command vuoto.
3. Ogni `git push` sul branch `main` aggiorna il sito.

## Da verificare con il ristorante
- Orari: 12–14 e 19–22, mercoledì chiuso (confermati)
- Piatti, descrizioni e tempi di frollatura effettivi
- Foto originali ad alta risoluzione (ora ritagliate da Instagram)
- Link diretto di prenotazione Google (quello nella bio Instagram)
- File originale del logo (ora ricostruito con font simili)
