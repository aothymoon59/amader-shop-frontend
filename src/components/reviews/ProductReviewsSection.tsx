import { useState } from "react";
import dayjs from "dayjs";
import { MessageSquare, Send, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import {
  useCreateReplyMutation,
  useCreateReviewMutation,
  useGetProductReviewsQuery,
  useGetReviewEligibilityQuery,
} from "@/redux/features/reviews/reviewApi";

type ProductReviewsSectionProps = {
  productId: string;
};

const StarRow = ({
  rating,
  onSelect,
  interactive = false,
}: {
  rating: number;
  onSelect?: (value: number) => void;
  interactive?: boolean;
}) => (
  <div className="flex items-center gap-1">
    {Array.from({ length: 5 }).map((_, index) => {
      const value = index + 1;
      const isFilled = value <= rating;

      return (
        <button
          key={value}
          type="button"
          onClick={interactive && onSelect ? () => onSelect(value) : undefined}
          disabled={!interactive}
          className={interactive ? "transition-transform hover:scale-110" : "cursor-default"}
        >
          <Star
            className={`h-4 w-4 ${isFilled ? "fill-warning text-warning" : "text-muted-foreground/40"}`}
          />
        </button>
      );
    })}
  </div>
);

const ProductReviewsSection = ({ productId }: ProductReviewsSectionProps) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [activeReplyReviewId, setActiveReplyReviewId] = useState<string | null>(null);
  const [replyComment, setReplyComment] = useState("");

  const { data: reviewResponse, isLoading } = useGetProductReviewsQuery(productId);
  const { data: eligibilityResponse } = useGetReviewEligibilityQuery(productId, {
    skip: !user || user.role !== "customer",
  });
  const [createReview, { isLoading: isCreatingReview }] =
    useCreateReviewMutation();
  const [createReply, { isLoading: isCreatingReply }] =
    useCreateReplyMutation();

  const summary = reviewResponse?.data?.summary;
  const reviews = reviewResponse?.data?.reviews || [];
  const eligibility = eligibilityResponse?.data;

  const handleReviewSubmit = async () => {
    if (!comment.trim()) {
      toast({
        title: "Comment required",
        description: "Please write a short review before submitting.",
        variant: "destructive",
      });
      return;
    }

    try {
      await createReview({
        productId,
        rating,
        comment: comment.trim(),
      }).unwrap();

      setComment("");
      setRating(5);
      toast({
        title: "Review submitted",
        description: "Your review is now visible on this product.",
      });
    } catch (error: any) {
      toast({
        title: "Review failed",
        description: error?.data?.message || "Could not submit your review.",
        variant: "destructive",
      });
    }
  };

  const handleReplySubmit = async (reviewId: string) => {
    if (!replyComment.trim()) {
      toast({
        title: "Reply required",
        description: "Please write a reply before submitting.",
        variant: "destructive",
      });
      return;
    }

    try {
      await createReply({
        reviewId,
        productId,
        comment: replyComment.trim(),
      }).unwrap();

      setReplyComment("");
      setActiveReplyReviewId(null);
      toast({
        title: "Reply posted",
        description: "Your reply has been added successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Reply failed",
        description: error?.data?.message || "Could not post your reply.",
        variant: "destructive",
      });
    }
  };

  return (
    <section className="mt-14 border-t pt-10">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Reviews & ratings</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Real feedback from customers after delivery, plus replies from logged-in users.
          </p>
        </div>

        <div className="rounded-2xl border bg-card px-5 py-4 text-right">
          <div className="text-3xl font-bold text-primary">
            {(summary?.averageRating || 0).toFixed(1)}
          </div>
          <div className="mt-2 flex justify-end">
            <StarRow rating={Math.round(summary?.averageRating || 0)} />
          </div>
          <div className="mt-2 text-sm text-muted-foreground">
            {summary?.totalReviews || 0} review(s)
          </div>
        </div>
      </div>

      {user?.role === "customer" ? (
        <div className="mb-8 rounded-2xl border bg-card p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-semibold">Share your experience</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Reviews are only enabled after your order has been delivered.
              </p>
            </div>
            <StarRow rating={rating} onSelect={setRating} interactive />
          </div>

          <Textarea
            className="mt-4"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            disabled={!eligibility?.canReview}
            placeholder={
              eligibility?.canReview
                ? "Write your review here"
                : eligibility?.reason || "You can review after delivery."
            }
          />

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              {eligibility?.canReview
                ? "Your review will appear immediately on the product page."
                : eligibility?.reason || "You are not eligible to review this product yet."}
            </p>
            <Button
              onClick={handleReviewSubmit}
              disabled={!eligibility?.canReview || isCreatingReview}
            >
              Submit review
            </Button>
          </div>
        </div>
      ) : user ? (
        <div className="mb-8 rounded-2xl border bg-card p-5 text-sm text-muted-foreground">
          Customers can review this product after delivery. You can still reply to existing reviews below.
        </div>
      ) : (
        <div className="mb-8 rounded-2xl border bg-card p-5 text-sm text-muted-foreground">
          Sign in to reply to a review. Customers can submit reviews after delivery.
        </div>
      )}

      {isLoading ? (
        <div className="rounded-2xl border bg-card p-8 text-sm text-muted-foreground">
          Loading reviews...
        </div>
      ) : reviews.length === 0 ? (
        <div className="rounded-2xl border bg-card p-8 text-sm text-muted-foreground">
          No reviews yet for this product.
        </div>
      ) : (
        <div className="space-y-5">
          {reviews.map((review) => (
            <div key={review.id} className="rounded-2xl border bg-card p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold">{review.customer.name}</h3>
                    {review.isFeatured ? (
                      <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                        Featured
                      </span>
                    ) : null}
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                    <StarRow rating={review.rating} />
                    <span>{dayjs(review.createdAt).format("MMMM D, YYYY")}</span>
                    <span>•</span>
                    <span>{review.product?.shopName || "Purchased shop"}</span>
                  </div>
                </div>
              </div>

              <p className="mt-4 leading-7 text-muted-foreground">{review.comment}</p>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setActiveReplyReviewId((current) =>
                      current === review.id ? null : review.id,
                    )
                  }
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Reply
                </Button>
                <span className="text-sm text-muted-foreground">
                  {review.replies.length} repl{review.replies.length === 1 ? "y" : "ies"}
                </span>
              </div>

              {activeReplyReviewId === review.id ? (
                <div className="mt-4 rounded-xl bg-secondary/40 p-4">
                  <Textarea
                    placeholder={
                      user ? "Write your reply" : "Please log in to reply"
                    }
                    value={replyComment}
                    onChange={(event) => setReplyComment(event.target.value)}
                    disabled={!user}
                  />
                  <div className="mt-3 flex justify-end">
                    <Button
                      size="sm"
                      onClick={() => handleReplySubmit(review.id)}
                      disabled={!user || isCreatingReply}
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Post reply
                    </Button>
                  </div>
                </div>
              ) : null}

              {review.replies.length > 0 ? (
                <div className="mt-5 space-y-3 border-t pt-4">
                  {review.replies.map((reply) => (
                    <div key={reply.id} className="rounded-xl bg-secondary/40 p-4">
                      <div className="flex flex-wrap items-center gap-2 text-sm">
                        <span className="font-medium">{reply.user.name}</span>
                        <span className="text-muted-foreground">
                          {reply.user.shopName ? `(${reply.user.shopName})` : `(${reply.user.role})`}
                        </span>
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
              ) : null}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default ProductReviewsSection;
