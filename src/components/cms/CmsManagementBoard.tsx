import { useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Edit,
  LayoutTemplate,
  Loader2,
  Search,
} from "lucide-react";

import CmsPageFormDialog from "@/components/cms/CmsPageFormDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import {
  useGetAdminHomePageSectionsQuery,
  useUpdateHomePageSectionsMutation,
} from "@/redux/features/generalApi/homePageCmsApi";
import {
  defaultHomePageSections,
  type HomePageSection,
} from "@/types/homePageCms";

type CmsManagementBoardProps = {
  role: "admin" | "super-admin";
};

type CmsPageDefinition = {
  key: "home";
  name: string;
  route: string;
  description: string;
};

const cmsPages: CmsPageDefinition[] = [
  {
    key: "home",
    name: "Home Page",
    route: "/",
    description:
      "Manage the public home page section order, titles, subtitles, and section content.",
  },
];

const CmsManagementBoard = ({ role }: CmsManagementBoardProps) => {
  const { data, isLoading, isError, refetch } = useGetAdminHomePageSectionsQuery();
  const [updateHomePageSections, { isLoading: isSaving }] =
    useUpdateHomePageSectionsMutation();
  const [search, setSearch] = useState("");
  const [selectedPageKey, setSelectedPageKey] = useState<CmsPageDefinition["key"]>("home");
  const [editingSection, setEditingSection] = useState<HomePageSection | null>(null);

  const selectedPage = cmsPages.find((page) => page.key === selectedPageKey) || cmsPages[0];

  const homeSections = useMemo(
    () =>
      [...(data?.data.sections ?? defaultHomePageSections)].sort(
        (a, b) => a.order - b.order,
      ),
    [data],
  );

  const filteredSections = useMemo(
    () =>
      homeSections.filter((section) =>
        [section.name, section.key, section.title, section.subtitle, section.description]
          .join(" ")
          .toLowerCase()
          .includes(search.toLowerCase()),
      ),
    [homeSections, search],
  );

  const handlePersist = async (
    nextSections: HomePageSection[],
    successMessage: string,
  ) => {
    try {
      await updateHomePageSections({ sections: nextSections }).unwrap();
      toast({
        title: "CMS updated",
        description: successMessage,
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description: "The CMS changes could not be saved.",
        variant: "destructive",
      });
    }
  };

  const handleMove = async (
    sectionKey: HomePageSection["key"],
    direction: "up" | "down",
  ) => {
    const currentIndex = homeSections.findIndex((section) => section.key === sectionKey);

    if (currentIndex === -1) {
      return;
    }

    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

    if (targetIndex < 0 || targetIndex >= homeSections.length) {
      return;
    }

    const nextSections = [...homeSections];
    const [currentSection] = nextSections.splice(currentIndex, 1);
    nextSections.splice(targetIndex, 0, currentSection);

    await handlePersist(
      nextSections.map((section, index) => ({
        ...section,
        order: index + 1,
      })),
      `${currentSection.name} has been moved ${direction}.`,
    );
  };

  const handleSave = async (section: HomePageSection) => {
    const nextSections = homeSections.map((currentSection) =>
      currentSection.key === section.key ? section : currentSection,
    );

    await handlePersist(nextSections, `${section.name} content has been saved.`);
    setEditingSection(null);
  };

  const enabledCount = homeSections.filter((section) => section.enabled).length;

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Page CMS</h1>
            <p className="text-sm text-muted-foreground">
              Manage CMS content page by page from the {role} panel. Home page is ready now, and
              more CMS pages can be added later in the same flow.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border bg-card p-5">
            <div className="mb-2 flex items-center gap-2 text-muted-foreground">
              <LayoutTemplate className="h-4 w-4" />
              <span className="text-sm">CMS Pages</span>
            </div>
            <div className="text-3xl font-bold">{cmsPages.length}</div>
          </div>
          <div className="rounded-xl border bg-card p-5">
            <div className="mb-2 text-sm text-muted-foreground">Home Sections</div>
            <div className="text-3xl font-bold">{homeSections.length}</div>
          </div>
          <div className="rounded-xl border bg-card p-5">
            <div className="mb-2 text-sm text-muted-foreground">Enabled Sections</div>
            <div className="text-3xl font-bold">{enabledCount}</div>
          </div>
        </div>

        <div className="grid gap-4">
          {cmsPages.map((page) => (
            <button
              key={page.key}
              type="button"
              onClick={() => setSelectedPageKey(page.key)}
              className={`rounded-xl border p-5 text-left transition-colors ${
                selectedPageKey === page.key
                  ? "border-primary bg-primary/5"
                  : "bg-card hover:border-primary/40"
              }`}
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-semibold">{page.name}</h2>
                    <Badge variant="outline">{page.route}</Badge>
                    <Badge>{page.key === "home" ? "Ready" : "Coming Soon"}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{page.description}</p>
                </div>
                <div className="text-sm text-muted-foreground">
                  {page.key === "home" ? `${homeSections.length} sections` : "0 sections"}
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="rounded-xl border bg-card p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-xl font-semibold">{selectedPage.name}</h2>
              <p className="text-sm text-muted-foreground">{selectedPage.description}</p>
            </div>
            <div className="flex w-full max-w-md items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search sections"
              />
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex min-h-[220px] items-center justify-center rounded-xl border bg-card">
            <div className="flex items-center gap-3 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Loading page CMS sections...</span>
            </div>
          </div>
        ) : isError ? (
          <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6">
            <p className="font-semibold text-destructive">Failed to load page CMS sections.</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Refresh and try again to reconnect the CMS manager.
            </p>
            <Button className="mt-4" variant="outline" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredSections.map((section, index) => (
              <div key={section.key} className="rounded-xl border bg-card p-5">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline">#{section.order}</Badge>
                      <h3 className="text-lg font-semibold">{section.name}</h3>
                      <Badge variant={section.enabled ? "default" : "secondary"}>
                        {section.enabled ? "Enabled" : "Hidden"}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium">{section.title || "No title set"}</p>
                    <p className="max-w-3xl text-sm text-muted-foreground">
                      {section.subtitle || section.description || "No subtitle or description set."}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Sequence position {index + 1} on the {selectedPage.name.toLowerCase()}.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      onClick={() => handleMove(section.key, "up")}
                      disabled={isSaving || index === 0}
                    >
                      <ArrowUp className="mr-2 h-4 w-4" />
                      Move Up
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleMove(section.key, "down")}
                      disabled={isSaving || index === homeSections.length - 1}
                    >
                      <ArrowDown className="mr-2 h-4 w-4" />
                      Move Down
                    </Button>
                    <Button onClick={() => setEditingSection(section)} disabled={isSaving}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Section
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {filteredSections.length === 0 ? (
              <div className="rounded-xl border bg-card p-6 text-center text-sm text-muted-foreground">
                No sections matched your search.
              </div>
            ) : null}
          </div>
        )}
      </div>

      <CmsPageFormDialog
        open={Boolean(editingSection)}
        section={editingSection}
        onOpenChange={(open) => {
          if (!open) {
            setEditingSection(null);
          }
        }}
        onSave={handleSave}
      />
    </>
  );
};

export default CmsManagementBoard;
