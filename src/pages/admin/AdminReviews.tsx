import DashboardLayout from "@/components/layouts/DashboardLayout";
import ReviewManagementBoard from "@/components/reviews/ReviewManagementBoard";

const AdminReviews = () => (
  <DashboardLayout role="admin">
    <ReviewManagementBoard role="admin" />
  </DashboardLayout>
);

export default AdminReviews;
