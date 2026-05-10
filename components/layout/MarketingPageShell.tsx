import PageShell from "@/components/layout/PageShell";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";

type Props = {
  children: React.ReactNode;
};

export default function MarketingPageShell({ children }: Props) {
  return (
    <PageShell>
      <div className="flex min-h-screen flex-col">
        <SiteHeader />

        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6 md:px-10 md:py-14 lg:px-16">
          {children}
        </main>

        <SiteFooter />
      </div>
    </PageShell>
  );
}