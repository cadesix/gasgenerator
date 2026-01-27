import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting migration: Moving Brief data to SavedScript...')

  // Get all briefs
  const briefs = await prisma.$queryRaw<Array<{
    id: string
    scriptId: string
    editorId: string | null
    status: string
    notes: string | null
    videoLink: string | null
  }>>`SELECT id, scriptId, editorId, status, notes, videoLink FROM Brief WHERE deletedAt IS NULL`

  console.log(`Found ${briefs.length} briefs to migrate`)

  // Update each script with its brief data
  for (const brief of briefs) {
    console.log(`Migrating brief ${brief.id} to script ${brief.scriptId}...`)

    await prisma.$executeRaw`
      UPDATE SavedScript
      SET
        editorId = ${brief.editorId},
        status = ${brief.status},
        notes = ${brief.notes},
        videoLink = ${brief.videoLink}
      WHERE id = ${brief.scriptId}
    `
  }

  console.log('Migration complete!')
}

main()
  .catch((e) => {
    console.error('Migration failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
