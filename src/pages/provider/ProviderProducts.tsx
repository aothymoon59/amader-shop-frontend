import { Button, Card, Result, Spin } from "antd";
import { CreditCardOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "@/components/layouts/DashboardLayout";
import ProductManagementPage from "@/components/products/ProductManagementPage";
import { useAuth } from "@/hooks/useAuth";

const ProviderProducts = () => {
  const navigate = useNavigate();
  const { userData } = useAuth();

  if (!userData) {
    return (
      <DashboardLayout role="provider">
        <div className="flex min-h-[360px] items-center justify-center">
          <Spin size="large" />
        </div>
      </DashboardLayout>
    );
  }

  if (!userData.isPaymentConfigured) {
    return (
      <DashboardLayout role="provider">
        <div className="mx-auto max-w-4xl">
          <Card bordered={false} className="shadow-sm">
            <Result
              icon={<LockOutlined className="text-amber-500" />}
              title="You need to add Payment details before Product Listing"
              subTitle="Complete your provider payment settings first. Once your payment information is saved, you will be redirected back here automatically."
              extra={
                <Button
                  type="primary"
                  size="large"
                  icon={<CreditCardOutlined />}
                  onClick={() =>
                    navigate(
                      "/provider/settings?tab=payment-settings&redirect=/provider/products"
                    )
                  }
                >
                  Go to Payment Settings
                </Button>
              }
            />
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="provider">
      <ProductManagementPage role="provider" />
    </DashboardLayout>
  );
};

export default ProviderProducts;
