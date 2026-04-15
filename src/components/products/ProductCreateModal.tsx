import { Button, Form } from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import { useEffect, useState } from "react";

import AntdModal from "@/components/shared/modal/AntdModal";
import ProductFormFields from "@/components/products/ProductFormFields";
import {
  buildProductPayload,
  getErrorMessage,
} from "@/components/products/productForm.helpers";
import type {
  CategoryOption,
  DeliveryZoneOption,
  ProductFormValues,
  ProviderOption,
} from "@/components/products/productManagement.types";
import { toast } from "@/hooks/use-toast";
import { useCreateProductMutation } from "@/redux/features/products/productApi";

type ProductCreateModalProps = {
  role: "provider" | "admin";
  isModalOpen: boolean;
  closeModal: () => void;
  categoryOptions: CategoryOption[];
  providerOptions: ProviderOption[];
  deliveryZoneOptions: DeliveryZoneOption[];
};

const ProductCreateModal = ({
  role,
  isModalOpen,
  closeModal,
  categoryOptions,
  providerOptions,
  deliveryZoneOptions,
}: ProductCreateModalProps) => {
  const [form] = Form.useForm<ProductFormValues>();
  const [imageFileList, setImageFileList] = useState<UploadFile[]>([]);
  const [createProduct, { isLoading }] = useCreateProductMutation();

  useEffect(() => {
    if (!isModalOpen) {
      form.resetFields();
      setImageFileList([]);
      return;
    }

    setImageFileList([]);
      form.setFieldsValue({
        isPublished: false,
        isFeatured: false,
        discountValue: 0,
        lowStockThreshold: 5,
        stock: 0,
        deliveryZoneIds: [],
        images: [],
      });
  }, [form, isModalOpen]);

  const handleClose = () => {
    form.resetFields();
    setImageFileList([]);
    closeModal();
  };

  const handleSubmit = async (values: ProductFormValues) => {
    try {
      const payload = buildProductPayload({
        role,
        values: {
          ...values,
          images: imageFileList,
        },
      });

      await createProduct(payload).unwrap();

      toast({
        title: "Product created",
        description: `${values.name} has been created successfully.`,
      });

      handleClose();
    } catch (error: unknown) {
      toast({
        title: "Product creation failed",
        description:
          getErrorMessage(error) ||
          "Something went wrong while saving the product.",
        variant: "destructive",
      });
    }
  };

  return (
    <AntdModal
      title="Create Product"
      width={860}
      height="75vh"
      isModalOpen={isModalOpen}
      closeModal={handleClose}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          isPublished: false,
          isFeatured: false,
          discountValue: 0,
          lowStockThreshold: 5,
          stock: 0,
          deliveryZoneIds: [],
          images: [],
        }}
      >
        <ProductFormFields
          role={role}
          categoryOptions={categoryOptions}
          providerOptions={providerOptions}
          deliveryZoneOptions={deliveryZoneOptions}
          imageFileList={imageFileList}
          onImageFileListChange={setImageFileList}
        />

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            type="primary"
            loading={isLoading}
            onClick={() => form.submit()}
          >
            Create Product
          </Button>
        </div>
      </Form>
    </AntdModal>
  );
};

export default ProductCreateModal;
