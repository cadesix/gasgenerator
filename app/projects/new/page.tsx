import { ProjectForm } from '@/components/projects/ProjectForm'

export default function NewProjectPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">Create App</h1>
        <p className="mt-2 text-neutral-600">Add a new app/project to your account</p>
      </div>

      <ProjectForm />
    </div>
  )
}
