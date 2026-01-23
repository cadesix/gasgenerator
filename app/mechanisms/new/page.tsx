import { MechanismForm } from '@/components/mechanisms/MechanismForm'

export default function NewMechanismPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">Create Mechanism</h1>
        <p className="mt-2 text-neutral-600">Add a copywriting principle to use as context</p>
      </div>

      <MechanismForm />
    </div>
  )
}
