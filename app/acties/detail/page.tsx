'use client'

import { ActionDetailPage } from '@/components/acties/ActionDetailPage'
import { useSearchParams } from 'next/navigation'

export default function ActionDetailPageRoute() {
  const searchParams = useSearchParams()
  const actionId = searchParams.get('id') || ''

  return <ActionDetailPage actionId={actionId} />
}
