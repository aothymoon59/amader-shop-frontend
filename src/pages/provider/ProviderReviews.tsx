import DashboardLayout from "@/components/layouts/DashboardLayout";
import ReviewManagementBoard from "@/components/reviews/ReviewManagementBoard";

const ProviderReviews = () => (
  <DashboardLayout role="provider">
    <ReviewManagementBoard role="provider" />
  </DashboardLayout>
);

export default ProviderReviews;
