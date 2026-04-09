import { Button, Col, Form, Image, Input, InputNumber, Row, Select, Switch, Upload } from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import { Plus } from "lucide-react";

import type {
  CategoryOption,
  ProductFormValues,
  ProviderOption,
} from "@/components/products/productManagement.types";
import type { ProductImage } from "@/redux/features/products/productApi";

const { TextArea } = Input;

const normalizeUploadValue = (
  event: { fileList?: UploadFile[] } | UploadFile[],
) => {
  if (Array.isArray(event)) {
    return event;
  }

  return event?.fileList || [];
};

type ProductFormFieldsProps = {
  role: "provider" | "admin";
  categoryOptions: CategoryOption[];
  providerOptions: ProviderOption[];
  retainedImages?: ProductImage[];
  onRemoveRetainedImage?: (imageId: string) => void;
  imageFileList?: UploadFile[];
  onImageFileListChange?: (fileList: UploadFile[]) => void;
};

const ProductFormFields = ({
  role,
  categoryOptions,
  providerOptions,
  retainedImages = [],
  onRemoveRetainedImage,
  imageFileList,
  onImageFileListChange,
}: ProductFormFieldsProps) => {
  return (
    <div className="overflow-x-hidden">
      <Row gutter={[16, 0]} wrap>
        {role === "admin" ? (
          <Col xs={24} md={12}>
            <Form.Item
              label="Provider"
              name="providerId"
              rules={[{ required: true, message: "Please select a provider" }]}
            >
              <Select
                showSearch
                optionFilterProp="label"
                placeholder="Select provider"
                options={providerOptions.map((provider) => ({
                  value: provider.userId,
                  label: `${provider.shopName} (${provider.user.name})`,
                }))}
              />
            </Form.Item>
          </Col>
        ) : null}

        <Col xs={24} md={12}>
          <Form.Item
            label="Category"
            name="categoryId"
            rules={[{ required: true, message: "Please select a category" }]}
          >
            <Select
              showSearch
              optionFilterProp="label"
              placeholder="Select category"
              options={categoryOptions.map((category) => ({
                value: category.id,
                label: category.name,
              }))}
            />
          </Form.Item>
        </Col>
 
        <Col xs={24} md={12}>
          <Form.Item
            label="Product Name"
            name="name"
            rules={[
              { required: true, message: "Please enter product name" },
              { min: 2, message: "Name must be at least 2 characters" },
            ]}
          >
            <Input placeholder="Wireless Headphones Pro" />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item label="SKU" name="sku">
            <Input placeholder="SKU-1001" />
          </Form.Item>
        </Col>

        <Col xs={24}>
          <Form.Item label="Short Description" name="shortDescription">
            <Input placeholder="A short summary for cards and lists" />
          </Form.Item>
        </Col>

        <Col xs={24}>
          <Form.Item label="Description" name="description">
            <TextArea rows={4} placeholder="Detailed product description" />
          </Form.Item>
        </Col>

        <Col xs={24} md={8}>
          <Form.Item
            label="Price"
            name="price"
            rules={[{ required: true, message: "Please enter selling price" }]}
          >
            <InputNumber min={0} step={0.01} className="w-full" placeholder="499.00" />
          </Form.Item>
        </Col>

        <Col xs={24} md={8}>
          <Form.Item label="Cost Price" name="costPrice">
            <InputNumber min={0} step={0.01} className="w-full" placeholder="350.00" />
          </Form.Item>
        </Col>

        <Col xs={24} md={8}>
          <Form.Item label="Barcode" name="barcode">
            <Input placeholder="1234567890123" />
          </Form.Item>
        </Col>

        <Col xs={24} md={8}>
          <Form.Item label="Discount Type" name="discountType">
            <Select
              allowClear
              placeholder="No discount"
              options={[
                { value: "PERCENTAGE", label: "Percentage" },
                { value: "FIXED", label: "Fixed Amount" },
              ]}
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={8}>
          <Form.Item label="Discount Value" name="discountValue">
            <InputNumber min={0} step={0.01} className="w-full" placeholder="0" />
          </Form.Item>
        </Col>

        <Col xs={24} md={8}>
          <Form.Item
            label="Initial / Current Stock"
            name="stock"
            rules={[{ required: true, message: "Please enter stock amount" }]}
          >
            <InputNumber min={0} step={1} className="w-full" />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item label="Low Stock Threshold" name="lowStockThreshold">
            <InputNumber min={0} step={1} className="w-full" />
          </Form.Item>
        </Col>

        <Col xs={12} md={6}>
          <Form.Item
            label="Published"
            name="isPublished"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Col>

        {role === "admin" ? (
          <Col xs={12} md={6}>
            <Form.Item
              label="Featured"
              name="isFeatured"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </Col>
        ) : null}

        {retainedImages.length && onRemoveRetainedImage ? (
          <Col xs={24}>
            <Form.Item label="Current Images">
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {retainedImages.map((image) => (
                  <div
                    key={image.id}
                    className="min-w-0 rounded-xl border border-border/80 p-2"
                  >
                    <Image
                      src={image.url}
                      alt="Product"
                      className="rounded-lg object-cover"
                      height={120}
                      width="100%"
                    />
                    <Button
                      danger
                      type="text"
                      className="mt-2 w-full"
                      onClick={() => onRemoveRetainedImage(image.id)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </Form.Item>
          </Col>
        ) : null}

        <Col xs={24}>
          <Form.Item
            label="Upload Images"
            name="images"
            valuePropName="fileList"
            getValueFromEvent={normalizeUploadValue}
            extra="You can upload up to 6 product images."
          >
            <div className="max-w-full overflow-x-hidden">
              <Upload
                beforeUpload={() => false}
                listType="picture-card"
                maxCount={6}
                multiple
                accept=".jpg,.jpeg,.png,.webp"
                fileList={imageFileList}
                onChange={({ fileList }) => onImageFileListChange?.(fileList)}
              >
                <div>
                  <Plus size={18} />
                  <div className="mt-2">Add Image</div>
                </div>
              </Upload>
            </div>
          </Form.Item>
        </Col>
      </Row>
    </div>
  );
};

export default ProductFormFields;
