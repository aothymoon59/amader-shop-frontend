import { useMemo, useState } from "react";
import dayjs from "dayjs";
import { Button, Empty, Input, Modal, Space, Spin, Table, Tag } from "antd";

import { toast } from "@/components/ui/use-toast";
import {
  useGetAdminReviewsQuery,
  useGetProviderReviewsQuery,
  useGetReviewByIdQuery,
  useToggleFeaturedReviewMutation,
  type ReviewRecord,
} from "@/redux/features/reviews/reviewApi";

type ReviewManagementBoardProps = {
  role: "admin" | "provider";
};

const ReviewManagementBoard = ({ role }: ReviewManagementBoardProps) => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);

  const query = useMemo(
    () => ({
      page,
      limit,
      search: search || undefined,
    }),
    [limit, page, search],
  );

  const adminReviewsQuery = useGetAdminReviewsQuery(query, {
    skip: role !== "admin",
  });
  const providerReviewsQuery = useGetProviderReviewsQuery(query, {
    skip: role !== "provider",
  });
  const activeReviewQuery =
    role === "admin" ? adminReviewsQuery : providerReviewsQuery;
  const { data, isLoading, isFetching } = activeReviewQuery;
  const { data: selectedReviewData, isFetching: isFetchingReview } =
    useGetReviewByIdQuery(selectedReviewId || "", {
      skip: !selectedReviewId,
    });
  const [toggleFeaturedReview, { isLoading: isUpdatingFeatured }] =
    useToggleFeaturedReviewMutation();

  const reviews = data?.data ?? [];
  const meta = data?.meta;

  const handleToggleFeatured = async (review: ReviewRecord) => {
    try {
      await toggleFeaturedReview({
        reviewId: review.id,
        isFeatured: !review.isFeatured,
        productId: review.productId,
      }).unwrap();

      toast({
        title: review.isFeatured ? "Feature removed" : "Review featured",
        description: review.isFeatured
          ? "This review will no longer show in the testimonials section."
          : "This review can now appear in What customers are saying.",
      });
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error?.data?.message || "Could not update featured status.",
        variant: "destructive",
      });
    }
  };

  const columns = [
    {
      title: "Customer",
      key: "customer",
      render: (_: unknown, review: ReviewRecord) => (
        <div>
          <div className="font-semibold">{review.customer.name}</div>
          <div className="text-xs text-muted-foreground">
            Shop: {review.product?.shopName || "Unknown"}
          </div>
        </div>
      ),
    },
    {
      title: "Review",
      key: "review",
      render: (_: unknown, review: ReviewRecord) => (
        <div>
          <div className="font-medium">{review.product?.name || "Unknown product"}</div>
          <div className="text-xs text-muted-foreground">
            {review.comment.length > 90
              ? `${review.comment.slice(0, 90)}...`
              : review.comment}
          </div>
        </div>
      ),
    },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
      render: (rating: number) => <Tag color="gold">{rating}/5</Tag>,
    },
    {
      title: "Replies",
      key: "replies",
      render: (_: unknown, review: ReviewRecord) => review.replies.length,
    },
    {
      title: "Featured",
      key: "featured",
      render: (_: unknown, review: ReviewRecord) =>
        review.isFeatured ? <Tag color="green">YES</Tag> : <Tag>NO</Tag>,
    },
    {
      title: "Created",
      key: "created",
      render: (_: unknown, review: ReviewRecord) =>
        dayjs(review.createdAt).format("MMM D, YYYY"),
    },
    {
      title: "Action",
      key: "action",
      render: (_: unknown, review: ReviewRecord) => (
        <Space>
          <Button onClick={() => setSelectedReviewId(review.id)}>View</Button>
          {role === "admin" ? (
            <Button
              type={review.isFeatured ? "default" : "primary"}
              onClick={() => handleToggleFeatured(review)}
              loading={isUpdatingFeatured}
            >
              {review.isFeatured ? "Unfeature" : "Feature"}
            </Button>
          ) : null}
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-card p-6">
        <h1 className="text-3xl font-bold">
          {role === "admin" ? "Customer Reviews" : "Vendor Reviews"}
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          {role === "admin"
            ? "See every product review in one table, open the details, and feature strong testimonials."
            : "See reviews related only to your products, including replies from customers and other logged-in users."}
        </p>
      </div>

      <div className="rounded-2xl border bg-card p-4">
        <Input.Search
          allowClear
          enterButton="Search"
          placeholder="Search by customer, shop, product, or review text"
          onSearch={(value) => {
            setSearch(value.trim());
            setPage(1);
          }}
        />
      </div>

      <div className="overflow-hidden rounded-2xl border bg-card">
        {isLoading ? (
          <div className="flex min-h-[260px] items-center justify-center">
            <Spin />
          </div>
        ) : reviews.length === 0 ? (
          <div className="p-10">
            <Empty description="No reviews found." />
          </div>
        ) : (
          <Table
            rowKey="id"
            columns={columns}
            dataSource={reviews}
            loading={isFetching}
            pagination={{
              current: meta?.page || page,
              pageSize: meta?.limit || limit,
              total: meta?.total || reviews.length,
              showSizeChanger: true,
              onChange: (nextPage, nextPageSize) => {
                setPage(nextPage);
                setLimit(nextPageSize);
              },
            }}
            scroll={{ x: 980 }}
          />
        )}
      </div>

      <Modal
        open={Boolean(selectedReviewId)}
        title="Review details"
        onCancel={() => setSelectedReviewId(null)}
        footer={null}
        width={760}
      >
        {isFetchingReview || !selectedReviewData?.data ? (
          <div className="flex min-h-[220px] items-center justify-center">
            <Spin />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="rounded-xl border bg-secondary/30 p-4">
              <div className="flex flex-wrap items-center gap-3">
                <Tag color="gold">{selectedReviewData.data.rating}/5</Tag>
                {selectedReviewData.data.isFeatured ? (
                  <Tag color="green">FEATURED</Tag>
                ) : null}
                <span className="text-sm text-muted-foreground">
                  {dayjs(selectedReviewData.data.createdAt).format("MMMM D, YYYY h:mm A")}
                </span>
              </div>
              <div className="mt-3 font-semibold">
                {selectedReviewData.data.customer.name}
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                Purchased shop name: {selectedReviewData.data.product?.shopName || "Unknown"}
              </div>
              <div className="mt-4 leading-7 text-muted-foreground">
                {selectedReviewData.data.comment}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Replies</h3>
              {selectedReviewData.data.replies.length === 0 ? (
                <p className="mt-3 text-sm text-muted-foreground">
                  No replies on this review yet.
                </p>
              ) : (
                <div className="mt-4 space-y-3">
                  {selectedReviewData.data.replies.map((reply) => (
                    <div key={reply.id} className="rounded-xl border p-4">
                      <div className="flex flex-wrap items-center gap-2 text-sm">
                        <span className="font-medium">{reply.user.name}</span>
                        <Tag>{reply.user.role}</Tag>
                        <span className="text-muted-foreground">
                          {dayjs(reply.createdAt).format("MMM D, YYYY h:mm A")}
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {reply.comment}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ReviewManagementBoard;
