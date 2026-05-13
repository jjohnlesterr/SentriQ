import SectionHeading from "@/components/shared/SectionHeading";

export default function AboutHero() {
  return (
    <SectionHeading
      badge="About SentriQ"
      title="Built for fair and focused assessments"
      description="SentriQ is a digital assessment and monitoring platform designed to help schools, teachers, and students create a more secure online examination environment."
      variant="page"
      align="center"
      className="mx-auto mb-10 max-w-3xl md:mb-14"
    />
  );
}