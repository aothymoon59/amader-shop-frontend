import { UploadOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Form,
  Image,
  Input,
  Space,
  Typography,
  Upload,
} from "antd";
import StringListField from "./StringListField";
import type { HeroSectionFieldsProps } from "./types";

const HeroSectionFields = ({
  form,
  bannerFileList,
  isUploadingBanners,
  onBannerFileListChange,
  renderButtonFields,
}: HeroSectionFieldsProps) => (
  <>
    {renderButtonFields({
      primaryTextLabel: "Main Button Text",
      primaryTextPlaceholder: "Start Shopping",
      primaryLinkLabel: "Main Button Link",
      primaryLinkPlaceholder: "/products",
      secondaryTextLabel: "Secondary Button Text",
      secondaryTextPlaceholder: "Become a Grocery Vendor",
      secondaryLinkLabel: "Secondary Button Link",
      secondaryLinkPlaceholder: "/provider/apply",
    })}
    <Form.List name="bannerImageUrls">
      {(fields, { remove }) => (
        <Space direction="vertical" size={16} style={{ width: "100%" }}>
          <Card size="small" title="Hero Banner Images" className="mb-4">
            <Space direction="vertical" size={12} style={{ width: "100%" }}>
              <Typography.Text type="secondary">
                These images rotate in the homepage hero banner.
              </Typography.Text>

              {fields.map((field, index) => {
                const imageUrl = form.getFieldValue([
                  "bannerImageUrls",
                  field.name,
                ]);

                return (
                  <Card size="small" key={field.key}>
                    <Space
                      direction="vertical"
                      size={12}
                      style={{ width: "100%" }}
                    >
                      <Form.Item hidden name={field.name}>
                        <Input />
                      </Form.Item>
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={`Hero banner ${index + 1}`}
                          className="max-h-40 rounded-lg object-cover"
                        />
                      ) : null}
                      <Button danger onClick={() => remove(field.name)}>
                        Remove Banner
                      </Button>
                    </Space>
                  </Card>
                );
              })}

              <Upload
                beforeUpload={() => false}
                multiple
                accept=".jpg,.jpeg,.png,.webp,.gif"
                listType="picture"
                fileList={bannerFileList}
                onChange={({ fileList }) => onBannerFileListChange(fileList)}
              >
                <Button icon={<UploadOutlined />} loading={isUploadingBanners}>
                  Choose Banner Images
                </Button>
              </Upload>
            </Space>
          </Card>
        </Space>
      )}
    </Form.List>

    <Card title="Quick Benefit Points" size="small" className="mb-4">
      <StringListField
        name="highlights"
        label={null}
        itemLabel="Benefit Point"
        placeholder="Fresh produce from nearby stores"
        addButtonText="Add Benefit Point"
      />
    </Card>

    <Card title="Promo Card Content" size="small" className="mb-4">
      <Form.Item label="Promo Card Eyebrow" name="promoCardSubtitle">
        <Input placeholder="Today's essentials" />
      </Form.Item>
      <Form.Item label="Promo Card Heading" name="promoCardTitle">
        <Input placeholder="Up to 25% off" />
      </Form.Item>

      <StringListField
        name="promoCardItems"
        label="Promo Card Bullet Points"
        itemLabel="Bullet Point"
        placeholder="Fresh fruits"
        addButtonText="Add Bullet Point"
      />
    </Card>

    <Card title="Trust & Delivery Info" size="small">
      <Form.Item label="Delivery Label" name="deliverySubtitle">
        <Input placeholder="Delivery" />
      </Form.Item>
      <Form.Item label="Delivery Value" name="deliveryTitle">
        <Input placeholder="30-60 min" />
      </Form.Item>
      <Form.Item label="Trust Label" name="trustedSubtitle">
        <Input placeholder="Trusted by" />
      </Form.Item>
      <Form.Item label="Trust Value" name="trustedTitle">
        <Input placeholder="10K+ families" />
      </Form.Item>
    </Card>
  </>
);

export default HeroSectionFields;
