import { useMemo, useState } from "react";
import { Edit, Eye, FileText, Globe, Search } from "lucide-react";

import CmsPageFormDialog from "@/components/cms/CmsPageFormDialog";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import { useCms, type CmsPage } from "@/context/CmsContext";

type CmsManagementBoardProps = {
  role: "admin" | "super-admin";
};

const CmsManagementBoard = ({ role }: CmsManagementBoardProps) => {
  const { pages, updatePage } = useCms();
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [editingPage, setEditingPage] = useState<CmsPage | null>(null);

  const filteredPages = useMemo(
    () =>
      pages.filter((page) =>
        [page.name, page.path, page.status, page.heroTitle].some((value) =>
          value.toLowerCase().includes(search.toLowerCase()),
        ),
      ),
    [pages, search],
  );

  const publishedCount = pages.filter((page) => page.status === "Published").length;
  const draftCount = pages.length - publishedCount;

  const handleSave = (values: Partial<CmsPage>) => {
    if (!editingPage) {
      return;
    }

    updatePage(editingPage.slug, values, user?.name ?? "Admin User");
    setEditingPage(null);
    toast({
      title: "Page updated",
      description: `${editingPage.name} content has been saved to the CMS demo store.`,
    });
  };

  return (
    <DashboardLayout role={role}>
      <div className="space-y-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold">CMS Management</h1>
            <p className="text-sm text-muted-foreground">
              Manage public page content, draft status, and basic SEO fields from one place.
            </p>
          </div>
          <div className="flex w-full max-w-md items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search pages, paths, or content"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border bg-card p-5">
            <div className="mb-2 flex items-center gap-2 text-muted-foreground">
              <FileText className="h-4 w-4" />
              <span className="text-sm">Total Pages</span>
            </div>
            <div className="text-3xl font-bold">{pages.length}</div>
          </div>
          <div className="rounded-xl border bg-card p-5">
            <div className="mb-2 flex items-center gap-2 text-muted-foreground">
              <Globe className="h-4 w-4" />
              <span className="text-sm">Published</span>
            </div>
            <div className="text-3xl font-bold">{publishedCount}</div>
          </div>
          <div className="rounded-xl border bg-card p-5">
            <div className="mb-2 flex items-center gap-2 text-muted-foreground">
              <Eye className="h-4 w-4" />
              <span className="text-sm">Draft Pages</span>
            </div>
            <div className="text-3xl font-bold">{draftCount}</div>
          </div>
        </div>

        <div className="grid gap-4">
          {filteredPages.map((page) => (
            <div
              key={page.slug}
              className="rounded-xl border bg-card p-5"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-semibold">{page.name}</h2>
                    <Badge variant={page.status === "Published" ? "default" : "secondary"}>
                      {page.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">{page.path}</div>
                  <p className="max-w-2xl text-sm text-muted-foreground">
                    {page.heroSubtitle}
                  </p>
                  <div className="text-xs text-muted-foreground">
                    Last updated {page.lastUpdated} by {page.updatedBy}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    onClick={() => window.open(page.path, "_self")}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View Page
                  </Button>
                  <Button onClick={() => setEditingPage(page)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Content
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <CmsPageFormDialog
        open={Boolean(editingPage)}
        page={editingPage}
        onOpenChange={(open) => {
          if (!open) {
            setEditingPage(null);
          }
        }}
        onSave={handleSave}
      />
    </DashboardLayout>
  );
};

export default CmsManagementBoard;
