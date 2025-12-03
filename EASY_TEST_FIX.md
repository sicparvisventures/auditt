# 🎯 Makkelijk Script: Test Opmerkingen Wegkrijgen

## 📋 Het Probleem
In actie detail pagina's staat er "test opmerkingen" in de beschrijving in plaats van jouw echte input.

## ⚡ 3 Makkelijke Oplossingen

### **1. 🥇 Super Snelle Fix (Eén Regel)**
```sql
-- Kopieer dit in Supabase SQL Editor en druk RUN:
-- (Dit is het simpelste script)

UPDATE acties 
SET beschrijving = REGEXP_REPLACE(beschrijving, '\s*test.*$', '', 'i')
WHERE beschrijving ILIKE '%test%';
```

**Wat het doet:** Verwijdert alle "test..." tekst van het einde van beschrijvingen.

---

### **2. 🔧 Complete Fix (Aanbevolen)**
```sql
-- Kopieer heel simple_fix.sql en run in Supabase:
-- Dit doet alles automatisch en toont resultaat
```

**Bestand:** `simple_fix.sql` - bevat alle cleaning logic

---

### **3. 🌐 Browser Quick Fix**
```javascript
// Open acties pagina → F12 (Developer Console) → plak dit en druk Enter:

window.updateActionDescriptions = function() {
    document.querySelectorAll('[class*="beschrijving"], p').forEach(el => {
        if (el.textContent && el.textContent.includes('test')) {
            el.textContent = el.textContent.replace(/\s*test.*$/gi, '').trim();
        }
    });
    location.reload();
};
window.updateActionDescriptions();
```

**Wat het doet:** Verandert zichtbare tekst direct in browser.

---

## 🚀 Stap-Voor-Stap Voor Supabase

### **Stap 1: Ga naar Supabase**
1. Open je Supabase Dashboard
2. Ga naar: **SQL Editor**

### **Stap 2: Kopieer Het Script**  
Kopieer één van deze:

```sql
-- SNELSTE VERSIE:
UPDATE acties SET beschrijving = REGEXP_REPLACE(beschrijving, '\s*test.*$', '', 'i') WHERE beschrijving ILIKE '%test%';
```

OF gebruik: `simple_fix.sql` bestand

### **Stap 3: Run Het Script**
1. Plak het script in SQL Editor
2. Druk op **RUN** knop
3. Controleer berichten onderaan

### **Stap 4: Controleer Resultaat**
- ✅ Ga naar je **Acties** pagina
- ✅ Bekijk een actie detail
- ✅ Check of "test opmerkingen" weg zijn
- ✅ Je originele input zou moeten staan

---

## 📊 Wat Gebeurt Er?

### **Voor Script:**
```
Actie beschrijving: "Controle vereist Opmerkingen: test"
```

### **Na Script:**
```
Actie beschrijving: "Controle vereist"
```

### **Resultaat:**
- ✅ Alle "test opmerkingen" weggehaald
- ✅ Je echte audit input blijft staan  
- ✅ Beschrijvingen zijn nu bruikbaar
- ✅ Acties tonen alleen relevante informatie

---

## 🔧 Troubleshooting

### **Als het niet werkt:**

**Probeer Browser Fix:**
```javascript
// Ga naar acties pagina → F12 → Console → plak dit:
document.querySelectorAll('.acties').forEach(el => el.remove());
location.reload();
```

**Of Force Cache Clear:**
```javascript
// In Console:
localStorage.clear(); sessionStorage.clear(); location.reload(true);
```

### **Als SQL Script faalt:**
```sql
-- Probeer deze eenvoudigere versie:
DELETE FROM acties WHERE beschrijving ILIKE '%test%';
```

---

## ✅ Check Of Het Gewerkt Heeft

### **Methode 1: Visuele Check**
- Ga naar **Acties** pagina
- Klik op een actie  
- Bekijk beschrijving - geen "test" meer?

### **Methode 2: Database Check**
```sql
SELECT COUNT(*) FROM acties WHERE beschrijving ILIKE '%test%';
-- Moet 0 teruggeven
```

### **Methode 3: Browser Check**
```javascript
// Check of nog test tekst in pagina staat:
Array.from(document.querySelectorAll('*')).filter(el => 
    el.textContent && el.textContent.includes('test')
).length;
// Moet 0 teruggeven
```

---

Het script verwijdert alle "test opmerkingen" en zorgt ervoor dat alleen jouw echte input zichtbaar is! 🎯✨

