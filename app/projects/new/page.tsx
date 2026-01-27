import { ProjectForm } from '@/components/projects/ProjectForm'
import { PageContainer } from '@/components/layout/PageContainer'

export default function NewProjectPage() {
  return (
    <PageContainer title="Create App">
      <ProjectForm />
    </PageContainer>
  )
}
