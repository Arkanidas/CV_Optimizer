import { prisma } from "@/lib/db"

export async function GET() {
  const created = await prisma.test.create({
    data: {
      name: "Leon",
    },
  })

  return Response.json(created)
}
