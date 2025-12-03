# 🚀 DEPLOYMENT CHECKLIST

## 📋 Stap-voor-stap Deployment

### **STAP 1: Database Setup**
1. Ga naar Supabase SQL Editor
2. Run `production_simple.sql` (in deze folder)
3. Controleer dat er geen errors zijn
4. Verify: `SELECT COUNT(*) FROM gebruikers;` → moet 9 users tonen
5. Verify: `SELECT COUNT(*) FROM filialen;` → moet 9 filialen tonen

### **STAP 2: Upload naar Cloudflare**
1. Ga naar Cloudflare Pages dashboard
2. Upload `cloudflare-deployment.zip`
3. Wacht tot deployment compleet is

### **STAP 3: Test de App**
1. Open je Cloudflare Pages URL
2. Login met: `ADMIN`, `INSP1`, `STORE`, etc.
3. Test: Nieuwe audit maken
4. Test: Audit detail bekijken (automatische redirect)
5. Test: Filialen lijst zichtbaar
6. Test: Gebruikers lijst zichtbaar

## 🔧 **Files in deze Deployment:**

### **Database SQL:**
- `production_simple.sql` ← **RUN DIT EERST**
- `production_ready.sql` (alternatief met RLS)

### **Build Files:**
- `cloudflare-deployment.zip` ← **UPLOAD DIT**
- `dist/` folder (lokale build files)

## ✅ **Verwachte Resultaten:**

### **Na Database Setup:**
- 9 gebruikers in database
- 9 filialen in database  
- RLS uitgeschakeld (zelfde als localhost)

### **Na Cloudflare Upload:**
- App werkt identiek aan localhost
- Login werkt met test users
- Nieuwe audits maken werkt
- Automatische redirect naar audit detail
- Alle data zichtbaar

## 🆘 **Als er Problemen zijn:**

### **Database Errors:**
- Check enum values in `supabase/schema.sql`
- Run `check_schema.sql` om schema te verifiëren

### **App Errors:**
- Check browser console voor JS errors
- Verify environment variables in Cloudflare
- Check Supabase connection

### **Data Niet Zichtbaar:**
- Run `production_simple.sql` opnieuw
- Check RLS status: `SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';`

## 📞 **Support:**
Als er problemen zijn, deel de error messages en ik help je verder!

