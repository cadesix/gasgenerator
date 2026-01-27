import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db/prisma'
import { EditorForm } from '@/components/editors/EditorForm'
import { PageContainer } from '@/components/layout/PageContainer'

export default async function EditEditorPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const editor = await prisma.editor.findFirst({
    where: {
      id: (await params).id,
      deletedAt: null
    },
  })

  if (!editor) {
    notFound()
  }

  return (
    <PageContainer title={editor.name}>
      <EditorForm editor={editor} />
    </PageContainer>
  )
}
