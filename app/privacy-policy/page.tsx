import MarketingPageShell from "@/components/layout/MarketingPageShell";
import PageTitle from "@/components/marketing/PageTitle";
import { Card } from "@/components/ui/card";

const sections = [
  {
    title: "Information We Collect",
    body: "SentriQ may collect basic account information, quiz data, student names, assessment responses, and monitoring activity related to online assessments.",
  },
  {
    title: "How We Use Information",
    body: "Collected information is used to provide quiz management, student access control, real-time monitoring, assessment reports, and platform improvements.",
  },
  {
    title: "Academic Monitoring",
    body: "SentriQ may record assessment-related activity such as quiz progress, tab switching, fullscreen activity, and other signals used to support academic integrity.",
  },
  {
    title: "Data Protection",
    body: "Reasonable security measures are applied to protect platform data. As the system grows, authentication, database, and access control will be managed through secure backend services.",
  },
  {
    title: "Contact",
    body: "For privacy-related questions, you may contact the developer through the contact page or connected social links.",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <MarketingPageShell>
      <PageTitle
        eyebrow="Privacy Policy"
        title="How SentriQ handles information"
        description="This page explains the basic information SentriQ may collect and how it is used to support secure digital assessments."
      />

      <Card className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl md:p-8">
        <div className="space-y-7">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-xl font-bold text-white">
                {section.title}
              </h2>
              <p className="mt-2 text-sm leading-7 text-slate-300">
                {section.body}
              </p>
            </section>
          ))}
        </div>

        <p className="mt-8 border-t border-white/10 pt-5 text-xs text-slate-500">
          Last updated: 2026
        </p>
      </Card>
    </MarketingPageShell>
  );
}