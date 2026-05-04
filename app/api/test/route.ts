import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  const created = await prisma.test.create({
    data: {
      name: "Leon"
    }
  })

  return Response.json(created)
}