import PageLoader from "@/components/shared/PageLoader";
import QuizList from "@/components/teacher/dashboard/QuizList";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import type { DashboardQuiz } from "@/hooks/teacher/useTeacherQuizzes";

type Props = {
  isLoading: boolean;
  quizzes: DashboardQuiz[];
  publishedQuizzes: DashboardQuiz[];
  draftQuizzes: DashboardQuiz[];
  onDeleteQuiz: (quizId: string) => void;
};

function TabCount({ value }: { value: number }) {
  return <span className="tabular-nums text-slate-500">{value}</span>;
}

export default function DashboardQuizTabs({
  isLoading,
  quizzes,
  publishedQuizzes,
  draftQuizzes,
  onDeleteQuiz,
}: Props) {
  if (isLoading) {
    return <PageLoader label="Loading quizzes..." variant="card" />;
  }

  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="mb-4 h-auto w-full md:w-auto">
        <TabsTrigger
          value="all"
          className="flex-1 gap-2 whitespace-nowrap text-xs sm:text-sm"
        >
          All
          <TabCount value={quizzes.length} />
        </TabsTrigger>

        <TabsTrigger
          value="published"
          className="flex-1 gap-2 whitespace-nowrap text-xs sm:text-sm"
        >
          Published
          <TabCount value={publishedQuizzes.length} />
        </TabsTrigger>

        <TabsTrigger
          value="drafts"
          className="flex-1 gap-2 whitespace-nowrap text-xs sm:text-sm"
        >
          Drafts
          <TabCount value={draftQuizzes.length} />
        </TabsTrigger>
      </TabsList>

      <TabsContent value="all">
        <QuizList items={quizzes} onDeleteQuiz={onDeleteQuiz} />
      </TabsContent>

      <TabsContent value="published">
        <QuizList items={publishedQuizzes} onDeleteQuiz={onDeleteQuiz} />
      </TabsContent>

      <TabsContent value="drafts">
        <QuizList items={draftQuizzes} onDeleteQuiz={onDeleteQuiz} />
      </TabsContent>
    </Tabs>
  );
}
