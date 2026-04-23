import { useMemo, useState } from "react";
import { Eye, FileDown, Printer, Search } from "lucide-react";
import { Descriptions, Modal, Spin, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";

import ReceiptPaperPreview from "@/components/receipts/ReceiptPaperPreview";
import { exportReceiptAsPdf } from "@/components/receipts/receiptPrint";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useSystemCurrency } from "@/hooks/useSystemCurrency";
import { defaultSystemCurrency } from "@/redux/features/generalApi/systemSettingsApi";
import {
  type ReceiptListItem,
  useGetReceiptByNumberQuery,
  useGetReceiptsQuery,
} from "@/redux/features/receipts/receiptsApi";
import { formatCurrencyAmount } from "@/utils/currency";

const ProviderReceipts = () => {
  const { currency = defaultSystemCurrency } = useSystemCurrency();
  const { userData } = useAuth();
  const [search, setSearch] = useState("");
  const [selectedReceiptNumber, setSelectedReceiptNumber] = useState<string | null>(null);
  const { data, isLoading, isFetching } = useGetReceiptsQuery({
    search,
    page: 1,
    limit: 50,
  });
  const { data: detailData, isFetching: isDetailFetching } =
    useGetReceiptByNumberQuery(selectedReceiptNumber as string, {
      skip: !selectedReceiptNumber,
    });

  const receipts = data?.data || [];
  const selectedReceipt = detailData?.data;

  const buildPrintableReceipt = () => {
    if (!selectedReceipt) {
      return null;
    }

    return {
      receiptNumber: selectedReceipt.receiptNumber,
      issuedAt: selectedReceipt.issuedAt,
      shopName: userData?.providerProfile?.shopName || userData?.name || "SHOP NAME",
      address: String(userData?.personalAddress || "Amader Shop"),
      phone: String(userData?.personalContact || ""),
      customerName:
        selectedReceipt.posSale?.customerName ||
        selectedReceipt.order?.customerName ||
        "Walk-in Customer",
      customerMobile:
        selectedReceipt.posSale?.customerMobile ||
        selectedReceipt.order?.customerPhone ||
        "",
      paymentMethod:
        selectedReceipt.posSale?.paymentMethod ||
        selectedReceipt.order?.paymentMethod ||
        "Cash",
      subtotalAmount:
        selectedReceipt.posSale?.subtotalAmount || selectedReceipt.totalAmount,
      discountAmount: selectedReceipt.posSale?.discountAmount || 0,
      totalAmount: selectedReceipt.totalAmount,
      items: selectedReceipt.posSale?.items || selectedReceipt.order?.items || [],
    };
  };

  const handleExportPdf = () => {
    const printable = buildPrintableReceipt();

    if (!printable) {
      return;
    }

    const opened = exportReceiptAsPdf(printable);

    if (!opened) {
      toast({
        title: "Popup blocked",
        description: "Please allow popups to export the receipt as PDF.",
        variant: "destructive",
      });
    }
  };

  const columns: ColumnsType<ReceiptListItem> = useMemo(
    () => [
      {
        title: "Receipt",
        dataIndex: "receiptNumber",
        key: "receiptNumber",
        render: (value: string) => <span className="font-medium">{value}</span>,
      },
      {
        title: "Type",
        key: "type",
        render: (_, record) => (
          <Tag color={record.posSale ? "green" : "blue"}>
            {record.posSale ? "POS" : "Online"}
          </Tag>
        ),
      },
      {
        title: "Customer",
        key: "customer",
        render: (_, record) =>
          record.posSale?.customerName || record.order?.customerName || "Walk-in Customer",
      },
      {
        title: "Mobile",
        key: "mobile",
        render: (_, record) =>
          record.posSale?.customerMobile || record.order?.customerPhone || "-",
      },
      {
        title: "Payment",
        key: "payment",
        render: (_, record) =>
          record.posSale?.paymentMethod || record.order?.paymentMethod || "POS Checkout",
      },
      {
        title: "Amount",
        dataIndex: "totalAmount",
        key: "totalAmount",
        render: (value: number) => formatCurrencyAmount(value, currency),
      },
      {
        title: "Issued At",
        dataIndex: "issuedAt",
        key: "issuedAt",
        render: (value: string) => new Date(value).toLocaleString(),
      },
      {
        title: "Actions",
        key: "actions",
        render: (_, record) => (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedReceiptNumber(record.receiptNumber)}
            >
              <Eye className="mr-1 h-4 w-4" /> View
            </Button>
          </div>
        ),
      },
    ],
    [currency],
  );

  const printableReceipt = buildPrintableReceipt();

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold">Receipts</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Review POS and online receipts, inspect details, and export a PDF copy.
            </p>
          </div>
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search receipts..."
              className="pl-10"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-4">
          <Table
            rowKey="receiptNumber"
            loading={isLoading || isFetching}
            columns={columns}
            dataSource={receipts}
            pagination={false}
            scroll={{ x: 980 }}
          />
        </div>

        <Modal
          open={Boolean(selectedReceiptNumber)}
          onCancel={() => setSelectedReceiptNumber(null)}
          footer={null}
          width={980}
          title={selectedReceipt?.receiptNumber || "Receipt Details"}
        >
          {isDetailFetching ? (
            <div className="flex min-h-[280px] items-center justify-center">
              <Spin />
            </div>
          ) : selectedReceipt ? (
            <div className="grid gap-6 lg:grid-cols-[1.1fr_360px]">
              <div className="space-y-6">
                <Descriptions
                  bordered
                  size="small"
                  column={2}
                  items={[
                    {
                      key: "type",
                      label: "Type",
                      children: selectedReceipt.posSale ? "POS" : "Online",
                    },
                    {
                      key: "issuedAt",
                      label: "Issued At",
                      children: new Date(selectedReceipt.issuedAt).toLocaleString(),
                    },
                    {
                      key: "customer",
                      label: "Customer",
                      children:
                        selectedReceipt.posSale?.customerName ||
                        selectedReceipt.order?.customerName ||
                        "Walk-in Customer",
                    },
                    {
                      key: "mobile",
                      label: "Mobile",
                      children:
                        selectedReceipt.posSale?.customerMobile ||
                        selectedReceipt.order?.customerPhone ||
                        "-",
                    },
                    {
                      key: "email",
                      label: "Email",
                      children:
                        selectedReceipt.posSale?.customerEmail ||
                        selectedReceipt.order?.customerEmail ||
                        "Not provided",
                    },
                    {
                      key: "paymentMethod",
                      label: "Payment Method",
                      children:
                        selectedReceipt.posSale?.paymentMethod ||
                        selectedReceipt.order?.paymentMethod ||
                        "POS Checkout",
                    },
                  ]}
                />

                <div className="overflow-hidden rounded-xl border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="p-3 text-left font-medium text-muted-foreground">Item</th>
                        <th className="p-3 text-left font-medium text-muted-foreground">Qty</th>
                        <th className="p-3 text-left font-medium text-muted-foreground">Unit Price</th>
                        <th className="p-3 text-left font-medium text-muted-foreground">Line Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(selectedReceipt.posSale?.items || selectedReceipt.order?.items || []).map((item) => (
                        <tr key={item.id} className="border-b last:border-0">
                          <td className="p-3">
                            <div className="font-medium">{item.product.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {item.product.sku || "No SKU"}
                            </div>
                          </td>
                          <td className="p-3">{item.quantity}</td>
                          <td className="p-3">
                            {formatCurrencyAmount(item.unitPrice, currency)}
                          </td>
                          <td className="p-3">
                            {formatCurrencyAmount(item.subtotal, currency)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="ml-auto max-w-sm space-y-2 rounded-xl border bg-muted/20 p-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>
                      {formatCurrencyAmount(
                        selectedReceipt.posSale?.subtotalAmount || selectedReceipt.totalAmount,
                        currency,
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Discount</span>
                    <span>
                      {formatCurrencyAmount(
                        selectedReceipt.posSale?.discountAmount || 0,
                        currency,
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between border-t pt-2 text-base font-bold">
                    <span>Total</span>
                    <span className="text-primary">
                      {formatCurrencyAmount(selectedReceipt.totalAmount, currency)}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setSelectedReceiptNumber(null)}>
                    Close
                  </Button>
                  <Button variant="outline" onClick={handleExportPdf}>
                    <FileDown className="mr-2 h-4 w-4" /> Export PDF
                  </Button>
                  <Button variant="hero" onClick={handleExportPdf}>
                    <Printer className="mr-2 h-4 w-4" /> Print Receipt
                  </Button>
                </div>
              </div>

              <div className="rounded-2xl border bg-muted/20 p-4">
                {printableReceipt ? <ReceiptPaperPreview {...printableReceipt} /> : null}
              </div>
            </div>
          ) : null}
        </Modal>
      </div>
    </>
  );
};

export default ProviderReceipts;
