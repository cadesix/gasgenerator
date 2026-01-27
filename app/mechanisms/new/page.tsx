import { MechanismForm } from '@/components/mechanisms/MechanismForm'
import { PageContainer } from '@/components/layout/PageContainer'

export default function NewMechanismPage() {
  return (
    <PageContainer title="Create Mechanism">
      <MechanismForm />
    </PageContainer>
  )
}
