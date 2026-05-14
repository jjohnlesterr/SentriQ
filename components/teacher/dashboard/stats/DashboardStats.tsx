import StatsCard from "@/components/teacher/dashboard/stats/StatsCard";

type Props = {
  total: number;
  published: number;
  drafts: number;
};

export default function DashboardStats({
  total,
  published,
  drafts,
}: Props) {
  return (
    <div className="grid grid-cols-3 gap-2.5 md:gap-4">
      <StatsCard
        type="total"
        label="Total Quizzes"
        value={total}
      />

      <StatsCard
        type="published"
        label="Published"
        value={published}
      />

      <StatsCard
        type="draft"
        label="Drafts"
        value={drafts}
      />
    </div>
  );
}