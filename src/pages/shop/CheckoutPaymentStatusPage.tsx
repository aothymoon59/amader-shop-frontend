import { useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import PublicLayout from "@/components/layouts/PublicLayout";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useAppDispatch } from "@/redux/hooks";
import { baseApi } from "@/redux/api/baseApi";
import {
  useGetOrderGroupQuery,
  useRetryPaymentMutation,
} from "@/redux/features/orders/orderApi";

const CheckoutPaymentStatusPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const orderGroupId = searchParams.get("orderGroupId") || "";
  const status = (searchParams.get("status") || "").toLowerCase();
  const { data, isLoading } = useGetOrderGroupQuery(orderGroupId, {
    skip: !orderGroupId,
  });
  const [retryPayment, { isLoading: isRetrying }] = useRetryPaymentMutation();

  useEffect(() => {
    if (status === "success") {
      dispatch(baseApi.util.invalidateTags([ "CART" ]));
    }
  }, [dispatch, status]);

  const handleRetry = async () => {
    if (!orderGroupId) {
      return;
    }

    const provider = data?.data.paymentProvider;
    if (provider !== "SSLCOMMERZ" && provider !== "BKASH") {
      toast({
        title: "Retry unavailable",
        description: "This payment provider cannot be retried automatically.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await retryPayment({
        orderGroupId,
        paymentProvider: provider,
      }).unwrap();

      if (response.data.payment?.redirectUrl) {
        window.location.href = response.data.payment.redirectUrl;
      }
    } catch (error: unknown) {
      const message =
        typeof error === "object" &&
        error !== null &&
        "data" in error &&
        typeof error.data === "object" &&
        error.data !== null &&
        "message" in error.data
          ? String(error.data.message)
          : "Unable to retry the payment right now.";

      toast({
        title: "Retry failed",
        description: message,
        variant: "destructive",
      });
    }
  };

  return (
    <PublicLayout>
      <div className="container max-w-3xl py-10">
        <div className="rounded-2xl border bg-card p-8">
          {isLoading ? (
            <div className="text-muted-foreground">Checking payment status...</div>
          ) : status === "success" ? (
            <>
              <h1 className="text-2xl font-bold">Payment successful</h1>
              <p className="mt-2 text-muted-foreground">
                Your order group{" "}
                <span className="font-medium">
                  {data?.data.groupNumber || orderGroupId}
                </span>{" "}
                has been confirmed successfully.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button variant="hero" onClick={() => navigate("/account/orders")}>
                  View Orders
                </Button>
                <Link to="/products">
                  <Button variant="outline">Continue Shopping</Button>
                </Link>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold">Payment failed</h1>
              <p className="mt-2 text-muted-foreground">
                The payment was not completed for{" "}
                <span className="font-medium">
                  {data?.data.groupNumber || orderGroupId}
                </span>
                . You can retry the same order without creating a duplicate.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button
                  variant="hero"
                  onClick={handleRetry}
                  disabled={isRetrying || !orderGroupId}
                >
                  {isRetrying ? "Retrying..." : "Retry Payment"}
                </Button>
                <Button variant="outline" onClick={() => navigate("/checkout")}>
                  Back to Checkout
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </PublicLayout>
  );
};

export default CheckoutPaymentStatusPage;
