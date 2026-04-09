import { Button, Form } from "antd";
import { useEffect, useState } from "react";

import AntdModal from "@/components/shared/modal/AntdModal";
import ProductFormFields from "@/components/products/ProductFormFields";
import {
  buildProductPayload,
  getErrorMessage,
} from "@/components/products/productForm.helpers";
import type {
  CategoryOption,
  ProductFormValues,
  ProviderOption,
} from "@/components/products/productManagement.types";
import { toast } from "@/hooks/use-toast";
import {
  type Product,
  type ProductImage,
  useUpdateProductMutation,
} from "@/redux/features/products/productApi";

type ProductEditModalProps = {
  role: "provider" | "admin";
  product: Product | null;
  isModalOpen: boolean;
  closeModal: () => void;
  categoryOptions: CategoryOption[];
  providerOptions: ProviderOption[];
};

const ProductEditModal = ({
  role,
  product,
  isModalOpen,
  closeModal,
  categoryOptions,
  providerOptions,
}: ProductEditModalProps) => {
  const [form] = Form.useForm<ProductFormValues>();
  const [retainedImages, setRetainedImages] = useState<ProductImage[]>([]);
  const [updateProduct, { isLoading }] = useUpdateProductMutation();

  useEffect(() => {
    if (!isModalOpen || !product) {
      form.resetFields();
      setRetainedImages([]);
      return;
    }

    setRetainedImages(product.images ?? []);
    form.setFieldsValue({
      providerId: product.providerId,
      categoryId: product.categoryId,
      name: product.name,
      description: product.description || "",
      shortDescription: product.shortDescription || "",
      price: product.price,
      costPrice: product.costPrice || undefined,
      discountType: product.discountType || undefined,
      discountValue: product.discountValue || 0,
      stock: product.stock,
      lowStockThreshold: product.lowStockThreshold,
      sku: product.sku || "",
      barcode: product.barcode || "",
      isPublished: product.isPublished,
      isFeatured: role === "admin" ? product.isFeatured : undefined,
      images: [],
    });
  }, [form, isModalOpen, product, role]);

  const handleClose = () => {
    form.resetFields();
    setRetainedImages([]);
    closeModal();
  };

  const handleSubmit = async (values: ProductFormValues) => {
    if (!product) {
      return;
    }

    try {
      const payload = buildProductPayload({
        role,
        values,
        retainedImageIds: retainedImages.map((image) => image.id),
        clearImages: !retainedImages.length,
      });

      await updateProduct({
        id: product.id,
        payload,
      }).unwrap();

      toast({
        title: "Product updated",
        description: `${values.name} has been updated successfully.`,
      });

      handleClose();
    } catch (error: unknown) {
      toast({
        title: "Product update failed",
        description:
          getErrorMessage(error) ||
          "Something went wrong while saving the product.",
        variant: "destructive",
      });
    }
  };

  return (
    <AntdModal
      title="Edit Product"
      width={860}
      height="75vh"
      isModalOpen={isModalOpen}
      closeModal={handleClose}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <ProductFormFields
          role={role}
          categoryOptions={categoryOptions}
          providerOptions={providerOptions}
          retainedImages={retainedImages}
          onRemoveRetainedImage={(imageId) =>
            setRetainedImages((current) =>
              current.filter((image) => image.id !== imageId),
            )
          }
        />

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            type="primary"
            loading={isLoading}
            onClick={() => form.submit()}
          >
            Update Product
          </Button>
        </div>
      </Form>
    </AntdModal>
  );
};

export default ProductEditModal;
