import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const email = 'admin@lounge.io'
  console.log(`Promoting ${email} to ADMIN...`)

  try {
    const user = await prisma.user.update({
      where: { email: email },
      data: { role: 'ADMIN' },
    })
    console.log(`Success! User ${user.name} (${user.email}) is now an ADMIN.`)
  } catch (error) {
    console.error(`Error: User with email ${email} not found or update failed.`)
    console.error(error)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
