import PageLoader from "@/components/shared/PageLoader";

import QuizList from "@/components/teacher/dashboard/quizzes/QuizList";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import type { Quiz } from "@/lib/shared/types";

type Props = {
  isLoading: boolean;
  quizzes: Quiz[];
  publishedQuizzes: Quiz[];
  draftQuizzes: Quiz[];
  onDeleteQuiz: (quizId: string) => void;
};

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
      <TabsList className="mb-4 h-auto w-full rounded-2xl border border-white/10 bg-white/5 p-1 backdrop-blur-xl md:mb-5 md:w-auto">
        <TabsTrigger
          value="all"
          className="flex-1 cursor-pointer whitespace-nowrap rounded-xl px-3 py-2 text-xs sm:text-sm"
        >
          All Quizzes
        </TabsTrigger>

        <TabsTrigger
          value="published"
          className="flex-1 cursor-pointer whitespace-nowrap rounded-xl px-3 py-2 text-xs sm:text-sm"
        >
          Published
        </TabsTrigger>

        <TabsTrigger
          value="drafts"
          className="flex-1 cursor-pointer whitespace-nowrap rounded-xl px-3 py-2 text-xs sm:text-sm"
        >
          Drafts
        </TabsTrigger>
      </TabsList>

      <TabsContent value="all">
        <QuizList
          items={quizzes}
          onDeleteQuiz={onDeleteQuiz}
        />
      </TabsContent>

      <TabsContent value="published">
        <QuizList
          items={publishedQuizzes}
          onDeleteQuiz={onDeleteQuiz}
        />
      </TabsContent>

      <TabsContent value="drafts">
        <QuizList
          items={draftQuizzes}
          onDeleteQuiz={onDeleteQuiz}
        />
      </TabsContent>
    </Tabs>
  );
}