import { defaultSystemCurrency } from "@/redux/features/generalApi/systemSettingsApi";
import { formatCurrencyAmount } from "@/utils/currency";

type ReceiptLineItem = {
  id: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  product: {
    name: string;
    sku?: string | null;
  };
};

type ReceiptPrintable = {
  receiptNumber: string;
  issuedAt: string;
  shopName: string;
  address?: string;
  phone?: string;
  customerName?: string;
  customerMobile?: string;
  paymentMethod?: string;
  subtotalAmount?: number;
  discountAmount?: number;
  totalAmount: number;
  items: ReceiptLineItem[];
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");

export const buildReceiptPrintHtml = (receipt: ReceiptPrintable) => {
  const subtotal = receipt.subtotalAmount ?? receipt.totalAmount;
  const discount = receipt.discountAmount ?? 0;
  const itemsHtml = receipt.items
    .map(
      (item) => `
        <div class="line-item">
          <div class="item-name">${escapeHtml(item.product.name)}</div>
          <div class="item-meta">
            <span>${item.quantity} x ${formatCurrencyAmount(
              item.unitPrice,
              defaultSystemCurrency,
            )}</span>
            <span>${formatCurrencyAmount(item.subtotal, defaultSystemCurrency)}</span>
          </div>
        </div>
      `,
    )
    .join("");

  return `<!doctype html>
  <html>
    <head>
      <meta charset="utf-8" />
      <title>${escapeHtml(receipt.receiptNumber)}</title>
      <style>
        body {
          margin: 0;
          background: #f4f4f4;
          font-family: "Courier New", monospace;
          color: #333;
        }
        .paper {
          width: 300px;
          margin: 16px auto;
          background: #fff;
          padding: 18px 16px 24px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.08);
        }
        .center { text-align: center; }
        .shop-name {
          font-size: 18px;
          font-weight: 700;
          letter-spacing: 2px;
          margin-bottom: 6px;
        }
        .muted { color: #666; font-size: 12px; }
        .divider {
          text-align: center;
          letter-spacing: 1px;
          color: #666;
          margin: 12px 0;
          font-size: 12px;
          white-space: nowrap;
          overflow: hidden;
        }
        .title {
          text-align: center;
          font-size: 18px;
          margin: 8px 0;
          letter-spacing: 1px;
        }
        .meta-row, .total-row {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          font-size: 13px;
          margin: 4px 0;
        }
        .section-head {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          font-weight: 700;
          margin-bottom: 8px;
        }
        .line-item { margin-bottom: 6px; }
        .item-name {
          font-size: 13px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .item-meta {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: #666;
        }
        .total-label {
          font-size: 18px;
          font-weight: 700;
        }
        .total-value {
          font-size: 22px;
          font-weight: 700;
        }
        .barcode {
          height: 38px;
          background:
            repeating-linear-gradient(
              90deg,
              #222 0px,
              #222 2px,
              transparent 2px,
              transparent 4px,
              #222 4px,
              #222 5px,
              transparent 5px,
              transparent 8px
            );
          margin: 14px auto 0;
          width: 180px;
        }
        @media print {
          body { background: white; }
          .paper {
            box-shadow: none;
            margin: 0 auto;
          }
        }
      </style>
    </head>
    <body>
      <div class="paper">
        <div class="center">
          <div class="shop-name">${escapeHtml(receipt.shopName)}</div>
          ${
            receipt.address
              ? `<div class="muted">${escapeHtml(receipt.address)}</div>`
              : ""
          }
          ${
            receipt.phone
              ? `<div class="muted">Tel. ${escapeHtml(receipt.phone)}</div>`
              : ""
          }
        </div>
        <div class="divider">******************************</div>
        <div class="title">CASH RECEIPT</div>
        <div class="divider">******************************</div>
        <div class="meta-row"><span>Receipt</span><span>${escapeHtml(
          receipt.receiptNumber,
        )}</span></div>
        <div class="meta-row"><span>Date</span><span>${escapeHtml(
          new Date(receipt.issuedAt).toLocaleString(),
        )}</span></div>
        ${
          receipt.customerName
            ? `<div class="meta-row"><span>Customer</span><span>${escapeHtml(
                receipt.customerName,
              )}</span></div>`
            : ""
        }
        ${
          receipt.customerMobile
            ? `<div class="meta-row"><span>Mobile</span><span>${escapeHtml(
                receipt.customerMobile,
              )}</span></div>`
            : ""
        }
        ${
          receipt.paymentMethod
            ? `<div class="meta-row"><span>Method</span><span>${escapeHtml(
                receipt.paymentMethod,
              )}</span></div>`
            : ""
        }
        <div class="divider">******************************</div>
        <div class="section-head"><span>Description</span><span>Price</span></div>
        ${itemsHtml}
        <div class="divider">******************************</div>
        <div class="total-row"><span>Subtotal</span><span>${formatCurrencyAmount(
          subtotal,
          defaultSystemCurrency,
        )}</span></div>
        ${
          discount > 0
            ? `<div class="total-row"><span>Discount</span><span>${formatCurrencyAmount(
                discount,
                defaultSystemCurrency,
              )}</span></div>`
            : ""
        }
        <div class="total-row">
          <span class="total-label">Total</span>
          <span class="total-value">${formatCurrencyAmount(
            receipt.totalAmount,
            defaultSystemCurrency,
          )}</span>
        </div>
        <div class="divider">******************************</div>
        <div class="center" style="font-weight:700; letter-spacing:1px;">THANK YOU!</div>
        <div class="barcode"></div>
      </div>
    </body>
  </html>`;
};

export const exportReceiptAsPdf = (receipt: ReceiptPrintable) => {
  const printWindow = window.open("", "_blank", "width=420,height=760");

  if (!printWindow) {
    return false;
  }

  printWindow.document.open();
  printWindow.document.write(buildReceiptPrintHtml(receipt));
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
  }, 300);

  return true;
};
