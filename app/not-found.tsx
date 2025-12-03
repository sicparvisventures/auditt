import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Alert } from '@/components/ui/Alert'
import { Home, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Pagina niet gevonden
          </h1>
          <p className="text-gray-600 mb-6">
            De pagina die je zoekt bestaat niet of is verplaatst.
          </p>
        </div>

        <Alert variant="info" className="mb-6">
          <div className="text-sm">
            <strong>404 Error</strong> - De gevraagde pagina kon niet worden gevonden.
          </div>
        </Alert>

        <div className="space-y-3">
          <Button
            asChild
            className="w-full text-white transition-colors"
            style={{ backgroundColor: '#132938' }}
          >
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Terug naar homepage
            </Link>
          </Button>
          
          <Button
            asChild
            variant="secondary"
            className="w-full"
          >
            <Link href="/pp-login">
              <Search className="w-4 h-4 mr-2" />
              Ga naar login
            </Link>
          </Button>
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            Controleer de URL of gebruik de navigatie om naar de juiste pagina te gaan.
          </p>
        </div>
      </div>
    </div>
  )
}
