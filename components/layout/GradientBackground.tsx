// Flat canvas behind app pages. Kept as a component so layouts share one background.
export default function GradientBackground() {
  return <div aria-hidden="true" className="pointer-events-none fixed inset-0 bg-canvas" />;
}
