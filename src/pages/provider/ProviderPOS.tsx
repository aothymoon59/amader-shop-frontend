import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Col, Form, Input as AntInput, InputNumber, Row, Select, Spin } from "antd";

import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { useSystemCurrency } from "@/hooks/useSystemCurrency";
import { defaultSystemCurrency } from "@/redux/features/generalApi/systemSettingsApi";
import { useCreatePosSaleMutation } from "@/redux/features/pos/posSalesApi";
import {
  type Product,
  useGetManagedProductsQuery,
} from "@/redux/features/products/productApi";
import { formatCurrencyAmount } from "@/utils/currency";
import { CreditCard, Minus, Plus, ReceiptText, Search, X } from "lucide-react";

type PosCartItem = {
  id: string;
  name: string;
  sku: string;
  price: number;
  qty: number;
  stock: number;
};

type PosCheckoutFormValues = {
  customerName: string;
  customerMobile: string;
  customerEmail?: string;
  paymentMethod: string;
  discountPercent: number;
};

const ProviderPOS = () => {
  const navigate = useNavigate();
  const { currency = defaultSystemCurrency } = useSystemCurrency();
  const [form] = Form.useForm<PosCheckoutFormValues>();
  const { data, isLoading, isFetching } = useGetManagedProductsQuery({
    limit: 100,
  });
  const [createPosSale, { isLoading: isCreatingSale }] = useCreatePosSaleMutation();
  const [cart, setCart] = useState<PosCartItem[]>([]);
  const [search, setSearch] = useState("");

  const formValues = Form.useWatch([], form);
  const discountValue = Number(formValues?.discountPercent || 0);

  const products = (data?.data || []).filter(
    (product) => !product.deletedAt && Number(product.stock || 0) > 0,
  );

  const filteredProducts = useMemo(
    () =>
      products.filter((product) =>
        [product.name, product.sku || "", product.barcode || ""].some((value) =>
          value.toLowerCase().includes(search.toLowerCase()),
        ),
      ),
    [products, search],
  );

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const discountAmount = subtotal * (Math.max(discountValue, 0) / 100);
  const grandTotal = Math.max(subtotal - discountAmount, 0);

  const addToCart = (product: Product) => {
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id);
      const stock = Number(product.stock || 0);

      if (existing) {
        if (existing.qty >= stock) {
          toast({
            title: "Stock limit reached",
            description: `Only ${stock} units available for ${product.name}.`,
            variant: "destructive",
          });
          return current;
        }

        return current.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item,
        );
      }

      return [
        ...current,
        {
          id: product.id,
          name: product.name,
          sku: product.sku || product.barcode || "N/A",
          price: Number(product.price || 0),
          qty: 1,
          stock,
        },
      ];
    });
  };

  const updateQty = (productId: string, qty: number) => {
    setCart((current) =>
      current.flatMap((item) => {
        if (item.id !== productId) {
          return [item];
        }

        if (qty <= 0) {
          return [];
        }

        if (qty > item.stock) {
          toast({
            title: "Stock limit reached",
            description: `Only ${item.stock} units available for ${item.name}.`,
            variant: "destructive",
          });
          return [item];
        }

        return [{ ...item, qty }];
      }),
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((current) => current.filter((item) => item.id !== productId));
  };

  const resetSale = () => {
    setCart([]);
    form.resetFields();
  };

  const handleCompleteSale = async () => {
    if (!cart.length) {
      toast({
        title: "No items in cart",
        description: "Add products to the current sale before checkout.",
        variant: "destructive",
      });
      return;
    }

    try {
      const values = await form.validateFields();
      const result = await createPosSale({
        items: cart.map((item) => ({
          productId: item.id,
          quantity: item.qty,
        })),
        customerName: values.customerName.trim() || "Walk-in Customer",
        customerMobile: values.customerMobile.trim(),
        customerEmail: values.customerEmail?.trim() || "",
        paymentMethod: values.paymentMethod,
        discountPercent: discountValue,
      }).unwrap();

      toast({
        title: "Sale completed",
        description: `${result.data.receipt?.receiptNumber || result.data.id} created successfully.`,
      });

      resetSale();
      navigate("/provider/receipts");
    } catch (error) {
      const message =
        typeof error === "object" &&
        error !== null &&
        "data" in error &&
        typeof error.data === "object" &&
        error.data !== null &&
        "message" in error.data
          ? String(error.data.message)
          : "Unable to complete POS sale.";

      toast({
        title: "Checkout failed",
        description: message,
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout role="provider">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Point of Sale</h1>
        {isLoading || isFetching ? (
          <div className="flex min-h-[320px] items-center justify-center">
            <Spin size="large" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-xl border bg-card p-6">
              <h2 className="mb-4 font-semibold">Add Products</h2>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by name, SKU, or barcode..."
                  className="pl-10"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                {filteredProducts.map((product) => (
                  <button
                    key={product.id}
                    className="rounded-lg border bg-secondary/50 p-4 text-left text-sm font-medium transition-colors hover:bg-secondary"
                    onClick={() => addToCart(product)}
                  >
                    <div>{product.name}</div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {product.sku || product.barcode || "No code"}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      Stock: {product.stock}
                    </div>
                    <div className="mt-2 font-semibold text-primary">
                      {formatCurrencyAmount(product.price, currency)}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-xl border bg-card p-6">
              <h2 className="mb-4 font-semibold">Current Sale</h2>
              <div className="mb-6 space-y-3">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between border-b py-2">
                    <div>
                      <div className="text-sm font-medium">{item.name}</div>
                      <div className="text-xs text-muted-foreground">{item.sku}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => updateQty(item.id, item.qty - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-6 text-center text-xs font-medium">{item.qty}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => updateQty(item.id, item.qty + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <span className="text-sm font-medium">
                        {formatCurrencyAmount(item.price * item.qty, currency)}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
                {cart.length === 0 ? (
                  <div className="py-6 text-center text-sm text-muted-foreground">
                    Add products from the left to start a new POS sale.
                  </div>
                ) : null}
              </div>

              <Form<PosCheckoutFormValues>
                form={form}
                layout="vertical"
                className="mb-6"
                initialValues={{
                  customerName: "Walk-in Customer",
                  customerMobile: "",
                  customerEmail: "",
                  paymentMethod: "Cash",
                  discountPercent: 0,
                }}
              >
                <Row gutter={12}>
                  <Col span={24}>
                    <Form.Item
                      label="Customer Name"
                      name="customerName"
                      rules={[{ required: true, message: "Customer name is required" }]}
                    >
                      <AntInput placeholder="Walk-in Customer" />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item
                      label="Customer Mobile"
                      name="customerMobile"
                      rules={[{ required: true, message: "Customer mobile is required" }]}
                      extra="This will be saved with the POS sale and visible on the receipt."
                    >
                      <AntInput placeholder="+8801XXXXXXXXX" />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item
                      label="Customer Email"
                      name="customerEmail"
                      rules={[{ type: "email", message: "Enter a valid email" }]}
                    >
                      <AntInput placeholder="customer@example.com" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Payment Method" name="paymentMethod">
                      <Select
                        options={[
                          { label: "Cash", value: "Cash" },
                          { label: "Card", value: "Card" },
                          { label: "Mobile Banking", value: "Mobile Banking" },
                        ]}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Discount Percentage"
                      name="discountPercent"
                      extra="Discount is now persisted with the POS sale."
                    >
                      <InputNumber
                        min={0}
                        max={100}
                        step={0.01}
                        className="w-full"
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>

              <div className="mb-4 border-t pt-4">
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-muted-foreground">Items</span>
                  <span>{totalItems}</span>
                </div>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrencyAmount(subtotal, currency)}</span>
                </div>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Discount ({discountValue.toFixed(2)}%)
                  </span>
                  <span>{formatCurrencyAmount(discountAmount, currency)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">
                    {formatCurrencyAmount(grandTotal, currency)}
                  </span>
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  size="lg"
                  onClick={() => navigate("/provider/receipts")}
                >
                  <ReceiptText className="mr-2 h-5 w-5" /> Receipts
                </Button>
                <Button
                  variant="hero"
                  className="flex-1"
                  size="lg"
                  onClick={handleCompleteSale}
                  disabled={isCreatingSale}
                >
                  <CreditCard className="mr-2 h-5 w-5" />
                  {isCreatingSale ? "Processing..." : "Complete Sale"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ProviderPOS;
