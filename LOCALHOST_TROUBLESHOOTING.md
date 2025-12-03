# Localhost Troubleshooting Guide

## 🚨 Probleem: Localhost Blijft Laden

### **Snelste Oplossing:**

#### **Stap 1: Stopserver en Herstart**
```bash
# Kills alle Next.js processen
pkill -f "next dev"

# Wacht even
sleep 2

# Start server opnieuw
npm run dev
```

#### **Stap 2: Browser Cache Leegmaken**
1. **Chrome/Safari:** Cmd+Shift+R (hard reload)
2. **Firefox:** Cmd+Shift+R (force reload)
3. **Of:** Developer tools → Network tab → "Disable cache"

#### **Stap 3: JavaScript Console Fix**
```javascript
// Open Developer Console (F12) en plak dit:
localStorage.clear();
location.reload(true);
```

### **🔧 Diagnose Tool:**

#### **Run Debug Script:**
1. **Open:** http://localhost:3000 in browser
2. **F12** → Developer Console
3. **Kopieer:** Inhoud van `quick_fix_localhost.js`
4. **Plak en Run** in console

## 📊 Mogelijke Oorzaken

### **1. AuthProvider Infinite Loop:**
- **Symptoom:** "Laden..." blijft eeuwig staan
- **Oorzaak:** Auth check hangt of loopt infinitief
- **Fix:** AuthProvider.tsx heeft waarschijnlijk loading timeout issue

### **2. Multiple Server Instances:**
- **Symptoom:** Port conflicts, loading delays
- **Oorzaak:** Meerdere `npm run dev` processen tegelijk
- **Fix:** `pkill -f "next dev"` dan opnieuw starten

### **3. Browser Cache Issues:**
- **Symptoom:** App toont geen updates, blijft laden
- **Oorzaak:** JavaScript files gecachet met bugs
- **Fix:** Hard reload (Cmd+Shift+R)

### **4. LocalStorage Corruption:**
- **Symptoom:** App kan niet starten, auth errors
- **Oorzaak:** Corrupt user data in localStorage
- **Fix:** Clear browser storage (Developer Tools → Application → Storage → Clear)

## 🚀 Werkenende Opstart Volgorde:

### **1. Server Opstarten:**
```bash
cd "/Users/dietmar/Desktop/pp ops -- intern audit"
npm run dev
```

### **2. Browser Gedrag:**
- **Eerste bezoek:** Dit zou snel moeten laden
- **Als het blijft laden:** Refresh (Cmd+R) of hard reload (Cmd+Shift+R)
- **Als dat niet werkt:** Clear browser cache

### **3. Verwachte URL Flow:**
```
http://localhost:3000 → /login → dashboard (voor ingelogde users)
http://localhost:3000 → automatic redirect
```

## 🔍 Debugging Stappen:

### **Step 1: Check Server Status**
```bash
curl -I http://localhost:3000
# Should return: HTTP/1.1 200 OK
```

### **Step 2: Browser Console**
```javascript
// Check voor errors:
console.log(localStorage.getItem('audit_user'));

// Clear alle auth data:
localStorage.clear();
location.reload();
```

### **Step 3: Network Tab**
- **Developer Tools** → **Network** tab
- **Reload page** en kijk naar:
  - **Failed requests** (rode entries)
  - **Slow requests** (>5 seconden)
  - **Blocked requests** (cross-origin issues)

### **Step 4: Force Reset**
```javascript
// Nuclear option - clear everything:
localStorage.clear();
sessionStorage.clear();
location.reload(true);
```

## 🛠️ Emergency Fixes:

### **Quick Fix 1: Browser Reset**
```javascript
// In console:
localStorage.clear();
sessionStorage.clear(); 
location.replace('/login');
```

### **Quick Fix 2: Server Restart**
```bash
pkill -f "next"
npm run dev
```

### **Quick Fix 3: Clean Install**
```bash
rm -rf .next
rm -rf node_modules/.cache
npm run dev
```

## 📱 Mobile Debugging:

### **Voor iPhone Testing:**
1. **Enable web inspector** in Safari settings
2. **Connect to Mac** via USB
3. **Developer menu** → iPhone's Safari → Localhost tab
4. **Sync with Mac Safari** voor console access

### **Expected Behavior:**
- **Localhost:** http://192.168.x.x:3000 (replacement van localhost)
- **Mobile Safari:** Should work same as desktop

## ⚠️ Common Issues:

### **Issue 1: Port Conflicts**
```bash
# Solution: Kill other processes
lsof -ti:3000 | xargs kill -9
lsof -ti:3001 | xargs kill -9
npm run dev
```

### **Issue 2: Memory Issues**
```bash
# Solution: Clear node cache
rm -rf .next
rm -rf node_modules/.cache
npm run dev
```

### **Issue 3: Environment Issues**
```bash
# Check env file
cat .env.local

# Ensure proper Supabase config
# Fix any missing API keys
```

## ✅ Success Indicators:

### **Server Running:**
- ✅ Terminal shows: "Ready in X.Xs"
- ✅ URL accessible: "http://localhost:3000"
- ✅ No errors in terminal output

### **App Working:**
- ✅ Pages load within 3 seconds
- ✅ Navigation works smoothly
- ✅ No infinite loading states
- ✅ Proper authentication flow

Als dit niet werkt, run eerst de **debug script** voor meer informatie! 🚀🔧

