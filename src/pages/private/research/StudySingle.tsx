import { Button } from "@/components/ui/button";
import Information from "@/features/study/components/Information";
import LinkedSurvey from "@/features/study/components/LinkedSurvey";
import Patients from "@/features/study/components/Patients";
import StudyArm from "@/features/study/components/StudyArm";
import { mockStudies } from "@/features/study/mock";
import { cn } from "@/lib/utils";
import { PageLink, PageTitle } from "@/routes/layouts/PageData";
import { ChevronLeftIcon, MoreVerticalIcon } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";

const tabOptions = [
  "Study Arm",
  "Linked Survey Schedules",
  "Patients",
  "Information",
] as const;
type TabOption = (typeof tabOptions)[number];

const tabClassName = (active: boolean) =>
  cn(
    "relative flex px-3 before:absolute before:top-full before:left-0 before:h-[2px] before:w-full before:content-[''] cursor-pointer font-light",
    {
      "before:bg-primary font-semibold pointer-events-none": active,
    },
  );

function StudySingle() {
  const breadcrumbs: Array<PageLink> = useMemo(
    () => [
      {
        title: "Home",
        path: "/start",
        isSeparator: false,
        isActive: false,
      },
      {
        title: "Research",
        isSeparator: false,
        isActive: false,
      },
      {
        title: "Study",
        path: "/research/study",
        isSeparator: false,
        isActive: false,
      },
    ],
    [],
  );
  const { studyId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabOption>("Study Arm");
  const studyBrief = mockStudies.find((s) => s.id === studyId)!;

  const detailComponents = useMemo(
    () => ({
      "Study Arm": <StudyArm />,
      "Linked Survey Schedules": <LinkedSurvey />,
      Patients: <Patients />,
      Information: <Information />,
    }),
    [],
  );

  const renderDetails = useCallback(
    (option: TabOption) => {
      return detailComponents[option] ?? null;
    },
    [detailComponents],
  );

  if (!studyId) return <Navigate to="/research/study" replace />;
  return (
    <>
      <PageTitle breadcrumbs={breadcrumbs}>Details</PageTitle>
      <main className="bg-background mx-6 my-6 min-h-[80vh] rounded-md px-4 pt-5 pb-3 shadow-md">
        <p
          className="group/goback text-muted-foreground flex w-[max-content] items-center gap-2 hover:cursor-pointer"
          onClick={() => navigate(-1)}
        >
          <ChevronLeftIcon size={20} />
          <span className="group-hover/goback:underline">Study Management</span>
        </p>

        <div className="mt-2 flex items-center justify-between">
          <h1 className="text-muted-foreground text-2xl">{studyBrief.title}</h1>
          <div className="flex items-center">
            <Button variant="outline">Label data</Button>
            <Button variant="ghost">
              <MoreVerticalIcon />
            </Button>
          </div>
        </div>

        <ul className="before:bg-border relative mt-2 flex w-full before:absolute before:top-full before:left-0 before:h-[2px] before:w-full before:content-['']">
          {tabOptions.map((tab) => (
            <li
              key={tab}
              className={tabClassName(tab === activeTab)}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </li>
          ))}
        </ul>
        <div className="mt-4">{renderDetails(activeTab)}</div>
      </main>
    </>
  );
}

export default StudySingle;
