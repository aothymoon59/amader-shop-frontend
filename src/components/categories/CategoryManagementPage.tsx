import { useMemo, useState } from "react";
import { Button, Form, Input, Modal } from "antd";
import type { ColumnsType } from "antd/es/table";
import { FolderTree, Pencil, Plus, Trash2 } from "lucide-react";

import CustomTable from "@/components/shared/table/CustomTable";
import { toast } from "@/hooks/use-toast";
import {
  type Category,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
  useUpdateCategoryMutation,
} from "@/redux/features/generalApi/categoriesApi";

type CategoryManagementPageProps = {
  roleLabel?: "Admin" | "Super Admin";
  embedded?: boolean;
};

type CategoryFormValues = {
  name: string;
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (
    typeof error === "object" &&
    error !== null &&
    "data" in error &&
    typeof error.data === "object" &&
    error.data !== null &&
    "message" in error.data
  ) {
    return String(error.data.message);
  }

  return fallback;
};

const CategoryManagementPage = ({
  roleLabel,
  embedded = false,
}: CategoryManagementPageProps) => {
  const [form] = Form.useForm<CategoryFormValues>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const { data, isLoading, refetch } = useGetCategoriesQuery();
  const [createCategory, { isLoading: isCreating }] =
    useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] =
    useDeleteCategoryMutation();

  const categories = useMemo(() => data?.data ?? [], [data]);
  const latestUpdatedAt = useMemo(() => {
    if (!categories.length) return null;

    return categories.reduce((latest, category) =>
      new Date(category.updatedAt) > new Date(latest.updatedAt) ? category : latest,
    ).updatedAt;
  }, [categories]);

  const openCreateModal = () => {
    setEditingCategory(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const openEditModal = (category: Category) => {
    setEditingCategory(category);
    form.setFieldsValue({ name: category.name });
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    form.resetFields();
  };

  const handleSubmit = async (values: CategoryFormValues) => {
    const payload = {
      name: values.name.trim(),
    };

    try {
      if (editingCategory) {
        await updateCategory({
          id: editingCategory.id,
          payload,
        }).unwrap();
        toast({
          title: "Category updated",
          description: `${payload.name} has been updated successfully.`,
        });
      } else {
        await createCategory(payload).unwrap();
        toast({
          title: "Category created",
          description: `${payload.name} has been added successfully.`,
        });
      }

      handleClose();
      void refetch();
    } catch (error: unknown) {
      toast({
        title: editingCategory ? "Update failed" : "Create failed",
        description: getErrorMessage(
          error,
          "Unable to save category right now.",
        ),
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (category: Category) => {
    try {
      await deleteCategory(category.id).unwrap();
      toast({
        title: "Category deleted",
        description: `${category.name} has been removed successfully.`,
      });
      void refetch();
    } catch (error: unknown) {
      toast({
        title: "Delete failed",
        description: getErrorMessage(
          error,
          "Unable to delete category right now.",
        ),
        variant: "destructive",
      });
    }
  };

  const columns = useMemo<ColumnsType<Category>>(
    () => [
      {
        title: "Category",
        key: "category",
        render: (_, category) => (
          <div>
            <div className="font-semibold">{category.name}</div>
            <div className="text-xs text-muted-foreground">
              Created {new Date(category.createdAt).toLocaleDateString()}
            </div>
          </div>
        ),
      },
      {
        title: "Updated",
        dataIndex: "updatedAt",
        key: "updatedAt",
        render: (value: string) => new Date(value).toLocaleDateString(),
      },
      {
        title: "Actions",
        key: "actions",
        render: (_, category) => (
          <div className="flex items-center gap-2">
            <Button
              type="text"
              icon={<Pencil size={16} />}
              onClick={() => openEditModal(category)}
            >
              Edit
            </Button>
            <Button
              type="text"
              danger
              icon={<Trash2 size={16} />}
              loading={isDeleting}
              onClick={() => {
                Modal.confirm({
                  title: "Delete this category?",
                  content:
                    "If products are using this category, deletion will be blocked.",
                  okText: "Delete",
                  cancelText: "Cancel",
                  okButtonProps: { danger: true },
                  onOk: () => handleDelete(category),
                });
              }}
            >
              Delete
            </Button>
          </div>
        ),
      },
    ],
    [isDeleting],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          {!embedded ? (
            <>
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-primary">
                Catalog Setup
              </p>
              <h1 className="mt-2 text-3xl font-bold">Category Management</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {roleLabel} panel can create, update, and remove product categories from here.
              </p>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold">Categories</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Create, update, and remove the categories used across products and storefront filters.
              </p>
            </>
          )}
        </div>
        <Button type="primary" icon={<Plus size={16} />} onClick={openCreateModal}>
          Add Category
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="rounded-2xl border bg-card p-4">
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Total Categories
          </div>
          <div className="mt-2 flex items-center gap-2 text-2xl font-bold">
            <FolderTree className="h-5 w-5 text-primary" />
            {categories.length}
          </div>
        </div>
        <div className="rounded-2xl border bg-card p-4">
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Latest Update
          </div>
          <div className="mt-2 text-2xl font-bold">
            {latestUpdatedAt ? new Date(latestUpdatedAt).toLocaleDateString() : "No data"}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border bg-card p-3">
        <CustomTable<Category>
          columns={columns}
          dataSource={categories}
          rowKey="id"
          isPagination={false}
          loading={isLoading}
        />
      </div>

      <Modal
        open={isModalOpen}
        title={editingCategory ? "Edit Category" : "Create Category"}
        onCancel={handleClose}
        onOk={() => form.submit()}
        okText={editingCategory ? "Update Category" : "Create Category"}
        okButtonProps={{ loading: isCreating || isUpdating }}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Category Name"
            name="name"
            rules={[
              { required: true, message: "Please enter category name" },
              { min: 2, message: "Category name must be at least 2 characters" },
              {
                validator: async (_, value) => {
                  if (!value || value.trim().length >= 2) {
                    return Promise.resolve();
                  }

                  return Promise.reject(
                    new Error("Category name must be at least 2 characters"),
                  );
                },
              },
            ]}
          >
            <Input placeholder="Electronics" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoryManagementPage;
