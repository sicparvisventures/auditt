'use client'

export default function EmergencyPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-ppgreen to-ppred">
      <div className="text-center text-white max-w-md mx-auto p-8">
        <div className="mb-6">
          <img src="/kipje.png" alt="AuditFlow" className="w-20 h-20 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">AuditFlow</h1>
          <p className="text-lg opacity-90">Interne Audit Tool voor Poule & Poulette</p>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">🚨 Emergency Mode</h2>
          <p className="mb-4">De app heeft problemen met laden. Hier zijn je opties:</p>
          
          <div className="space-y-3">
            <button 
              onClick={() => window.location.href = '/landing'}
              className="w-full bg-ppaccent text-white py-2 px-4 rounded-lg hover:bg-opacity-80 transition-colors"
            >
              Ga naar Landing Pagina
            </button>
            <button 
              onClick={() => window.location.href = '/pp-login'}
              className="w-full bg-white/20 text-white py-2 px-4 rounded-lg hover:bg-white/30 transition-colors"
            >
              Direct naar Login
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="w-full bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition-colors"
            >
              Herlaad Pagina
            </button>
          </div>
        </div>
        
        <div className="text-sm opacity-75 space-y-2">
          <p><strong>Mogelijke oorzaken:</strong></p>
          <ul className="text-left">
            <li>• JavaScript errors in de console</li>
            <li>• CSS bestanden laden niet</li>
            <li>• Provider components hebben problemen</li>
            <li>• Development server is niet gestart</li>
          </ul>
        </div>
        
        <div className="mt-6">
          <button 
            onClick={() => {
              console.log('Opening browser console...');
              alert('Open de browser console (F12) om errors te zien');
            }}
            className="text-sm underline opacity-75 hover:opacity-100"
          >
            Open Console voor Debug Info
          </button>
        </div>
      </div>
    </div>
  )
}


