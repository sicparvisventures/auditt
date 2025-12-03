# 🧹 Test Opmerkingen Verwijderen uit Acties

## 📊 Probleem
In de acties pagina staan overal "test opmerkingen" tekst, wat niet productief is voor gebruik.

## 🔍 Diagnose 
**Locatie van het probleem:**
- `acties` tabel: `beschrijving` veld bevat "test" tekst
- `audit_resultaten` tabel: `opmerkingen` en `verbeterpunt` velden bevatten "test" tekst  
- Deze komt van de audit resultaten waar "test" werd ingevuld tijdens testing

## ✅ Oplossing Scripts

### **Script 1: Check Test Data (`check_test_data.sql`)**
**Doel:** Bekijk welke data er precies aanwezig is
```sql
-- Toont alle acties met test tekst
-- Toont alle audit_resultaten met test tekst  
-- Geeft count van hoeveel records aangetast zijn
```

### **Script 2: Clean Test Data (`clean_test_data.sql`)**
**Doel:** Verwijder alle test tekst uit de database

**Voert uit:**
- ✅ Verwijdert "test" uit `audit_resultaten.opmerkingen` (zet NULL)
- ✅ Verwijdert "test" uit `audit_resultaten.verbeterpunt` (zet NULL)
- ✅ Reinigt "test" tekst uit `acties.beschrijving` 
- ✅ Verwijdert puur test acties
- ✅ Voorkomt lege beschrijvingen

### **Script 3: Improve Action Creation (`improve_action_creation.sql`)**
**Doel:** Verbeteren zodat toekomstige acties geen test tekst bevatten

**Updates:**
- ✅ `create_actions_from_audit_results` functie met test tekst filter
- ✅ Alleen echte opmerkingen worden opgenomen in acties
- ✅ Lege beschrijvingen worden vervangen door zinvolle tekst

## 🚀 Hoe Te Gebruiken

### **Stap 1: Check Current Data**
```sql
-- Run in Supabase SQL Editor:
\i check_test_data.sql
```

### **Stap 2: Clean All Test Data**  
```sql
-- Run in Supabase SQL Editor:
\i clean_test_data.sql
```

### **Stap 3: Improve Future Actions**
```sql 
-- Run in Supabase SQL Editor:
\i improve_action_creation.sql
```

### **Stap 4: Test Result**
- ✅ Ga naar **Acties** pagina op localhost
- ✅ Controleer of alle "test opmerkingen" weg zijn
- ✅ Controleer of acties nog wel nuttige informatie bevatten

## 📋 Verwachte Resultaten

### **Voor Script:**
```
Acties met test tekst: X aantal
Audit resultaten met test tekst: Y aantal  
```

### **Na Script:**
```
Acties met test tekst: 0
Audit resultaten met test tekst: 0
✅ SUCCESS: Alle test data is verwijderd!
```

### **In De App:**
- ✅ **Acties pagina:** Geen "test opmerkingen" meer zichtbaar
- ✅ **Acties detail:** Beschrijvingen bevatten alleen echte informatie
- ✅ **Nieuwe audits:** Genereren acties zonder test tekst

## 🔧 Alternative Approach (Als Scripts Niet Werken)

### **Handmatig Via Browser:**
1. **Open:** De acties pagina waar test tekst staat
2. **Developer Console:** F12 → Console
3. **Run Commando:**
```javascript
// Force refresh acties data
fetch('/api/debug').then(() => location.reload());
```

### **Via Supabase Dashboard:**
1. **Database** → **Tables** → `acties`
2. **Edit filters** → Search: "test"
3. **Manual cleanup** van alle gevonden records

## 📝 Notes

### **Waarom Dit Probleem Optradt:**
- ✅ Test fill-ins werden gebruikt tijdens audit creatie
- ✅ Deze waren automatisch opgeslagen in database  
- ✅ Acties functionaliteit gebruikt deze oud data

### **Voorkomen Van Toekomstige Test Data:**
- ✅ Verbeterde `create_actions_from_audit_results` functie filtert test tekst
- ✅ Alleen echte opmerkingen worden opgenomen
- ✅ Audit entry forms moeten worden verbeterd

### **Compliance:**
- ✅ Scripts zijn **veeilig** - ze geven eerst preview van wat wordt aangetast
- ✅ **Backup niet nodig** maar altijd goed om te hebben
- ✅ Scripts gebruiken **ILIKE '%test%'** voor flexible matching

## 🎯 Success Verification  

### **Visual Check:**
- ✅ Acties pagina toont geen "test opmerkingen" 
- ✅ Acties hebben zinvolle beschrijvingen
- ✅ Alle functionaliteit werkt nog steeds

### **Database Check:**
```sql
SELECT COUNT(*) FROM acties WHERE beschrijving ILIKE '%test%';
-- Should return: 0

SELECT COUNT(*) FROM audit_resultaten WHERE opmerkingen ILIKE '%test%';
-- Should return: 0  
```

Run de scripts en de test opmerkingen zullen verdwijnen! 🚀✨

