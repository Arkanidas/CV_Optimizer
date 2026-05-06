
import ShapeGrid from "@/components/ShapeGrid";

export default function Home() {
  return (
    <main className="relative min-h-screen min-h-dvh overflow-hidden bg-[#120f17] text-white">
      <div className="absolute inset-0">
        <ShapeGrid
          shape="hexagon"
          squareSize={52}
          direction="diagonal"
          speed={0.35}
          borderColor="rgba(255, 255, 255, 0.18)"
          hoverFillColor="rgba(255, 255, 255, 0.14)"
          hoverTrailAmount={6}
        />
      </div>

      <section className="relative z-10 flex min-h-screen min-h-dvh items-center justify-center px-6">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-white/45">
            CV Optimizer
          </p>
          <h1 className="mt-4 text-5xl font-semibold tracking-tight sm:text-7xl">
            Land the page first.
          </h1>
        </div>
      </section>
    </main>
  );
}
