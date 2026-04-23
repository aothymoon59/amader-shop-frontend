import { useEffect, useRef } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle2, ReceiptText, XCircle } from "lucide-react";


import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";

const CheckoutPaymentStatusPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const status = (searchParams.get("status") || "").toLowerCase();
  const orderNumber = searchParams.get("orderNumber") || "";
  const paymentMethod = searchParams.get("paymentMethod") || "";
  const paymentStatus = searchParams.get("paymentStatus") || "";
  const receiptNumber = searchParams.get("receiptNumber") || "";
  const failureMessage =
    searchParams.get("message") || "The order could not be completed.";
  const isSuccess = status === "success";
  const hasClearedCartRef = useRef(false);

  useEffect(() => {
    if (isSuccess && !hasClearedCartRef.current) {
      hasClearedCartRef.current = true;
      clearCart();
    }
  }, [clearCart, isSuccess]);

  return (
    
      <div className="container max-w-3xl py-10">
        <div className="rounded-2xl border bg-card p-8">
          {isSuccess ? (
            <>
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <h1 className="text-2xl font-bold">Order placed successfully</h1>
              <p className="mt-2 text-muted-foreground">
                Your {paymentMethod === "ONLINE" ? "online payment" : "cash on delivery"} order
                {orderNumber ? (
                  <>
                    {" "}
                    <span className="font-medium">{orderNumber}</span>
                  </>
                ) : null}{" "}
                has been confirmed.
              </p>
              <div className="mt-6 grid gap-3 rounded-xl border bg-secondary/30 p-4 sm:grid-cols-2">
                <div>
                  <div className="text-xs uppercase tracking-wide text-muted-foreground">
                    Payment Method
                  </div>
                  <div className="mt-1 font-medium">{paymentMethod || "N/A"}</div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wide text-muted-foreground">
                    Payment Status
                  </div>
                  <div className="mt-1 font-medium">{paymentStatus || "N/A"}</div>
                </div>
                {receiptNumber ? (
                  <div className="sm:col-span-2">
                    <div className="text-xs uppercase tracking-wide text-muted-foreground">
                      Receipt Number
                    </div>
                    <div className="mt-1 flex items-center gap-2 font-medium">
                      <ReceiptText className="h-4 w-4 text-primary" />
                      {receiptNumber}
                    </div>
                  </div>
                ) : null}
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button variant="hero" onClick={() => navigate("/account/orders")}>
                  View Orders
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/account/payments")}
                >
                  Payment History
                </Button>
                <Link to="/products">
                  <Button variant="outline">Continue Shopping</Button>
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-rose-500/10 text-rose-600">
                <XCircle className="h-7 w-7" />
              </div>
              <h1 className="text-2xl font-bold">Order failed</h1>
              <p className="mt-2 text-muted-foreground">
                {failureMessage}
              </p>
              <div className="mt-6 rounded-xl border bg-secondary/30 p-4 text-sm text-muted-foreground">
                {paymentMethod ? `Payment method: ${paymentMethod}` : "Please review your information and try again."}
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button variant="hero" onClick={() => navigate("/checkout")}>
                  Try Again
                </Button>
                <Link to="/cart">
                  <Button variant="outline">Back to Cart</Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    
  );
};

export default CheckoutPaymentStatusPage;
