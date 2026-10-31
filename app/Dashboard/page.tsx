import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getSavedLetterLimit, type SubscriptionTier } from "@/lib/AI/tiers";
import SavedLettersGrid from "./dashComponents/SavedLettersGrid";
import type { SavedLetter } from "./dashComponents/CoverLetterTools/wizardSession";

export default async function DashboardHomePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const tier: SubscriptionTier = session.user.tier ?? "free";

  const rows = await prisma.coverLetter.findMany({
    where: { userId: session.user.id },
    // Oldest first, so letter number 1 stays in place and new ones are
    // added to the right. Change "asc" to "desc" for newest first.
    orderBy: { createdAt: "asc" },
    take: 100,
    select: {
      id: true,
      runId: true,
      content: true,
      templateId: true,
      settings: true,
      contact: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  const letters: SavedLetter[] = rows.map((row) => ({
    ...row,
    settings: row.settings as unknown as SavedLetter["settings"],
    contact: row.contact as unknown as SavedLetter["contact"],
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  }));

  return (
    <div>
      <h1 className="text-3xl font-semibold text-white light:text-stone-900">
        Welcome back {session.user.firstName ?? ""}
      </h1>

      <SavedLettersGrid letters={letters} limit={getSavedLetterLimit(tier)} />
    </div>
  );
}