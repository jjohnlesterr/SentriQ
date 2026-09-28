import PageShell from "@/components/layout/PageShell";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";
import { cn } from "@/lib/shared/utils";

type Props = {
  children: React.ReactNode;
  contentClassName?: string;
};

export default function MarketingPageShell({ children, contentClassName }: Props) {
  return (
    <PageShell>
      <div className="flex min-h-screen flex-col">
        <SiteHeader />

        <main
          className={cn(
            "mx-auto w-full max-w-6xl flex-1 px-4 py-12 sm:px-6 md:py-16 lg:px-8",
            contentClassName,
          )}
        >
          {children}
        </main>

        <SiteFooter />
      </div>
    </PageShell>
  );
}
