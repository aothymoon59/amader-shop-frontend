import { defaultSystemCurrency } from "@/redux/features/generalApi/systemSettingsApi";
import { formatCurrencyAmount } from "@/utils/currency";

type ReceiptPaperPreviewProps = {
  shopName: string;
  address?: string;
  phone?: string;
  receiptNumber: string;
  issuedAt: string;
  customerName?: string;
  customerMobile?: string;
  paymentMethod?: string;
  subtotalAmount?: number;
  discountAmount?: number;
  totalAmount: number;
  items: Array<{
    id: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
    product: {
      name: string;
      sku?: string | null;
    };
  }>;
};

const ReceiptPaperPreview = ({
  shopName,
  address,
  phone,
  receiptNumber,
  issuedAt,
  customerName,
  customerMobile,
  paymentMethod,
  subtotalAmount,
  discountAmount,
  totalAmount,
  items,
}: ReceiptPaperPreviewProps) => {
  const subtotal = subtotalAmount ?? totalAmount;
  const discount = discountAmount ?? 0;

  return (
    <div className="mx-auto w-[300px] rounded-[24px] border bg-white p-5 font-mono text-[#333] shadow-sm">
      <div className="text-center">
        <div className="text-[28px] font-bold tracking-[0.2em]">{shopName}</div>
        {address ? <div className="text-xs text-slate-500">{address}</div> : null}
        {phone ? <div className="text-xs text-slate-500">Tel. {phone}</div> : null}
      </div>

      <div className="my-3 text-center text-xs tracking-[0.18em] text-slate-500">
        ******************************
      </div>
      <div className="text-center text-2xl tracking-[0.16em]">CASH RECEIPT</div>
      <div className="my-3 text-center text-xs tracking-[0.18em] text-slate-500">
        ******************************
      </div>

      <div className="space-y-1 text-xs">
        <div className="flex justify-between gap-3">
          <span>Receipt</span>
          <span>{receiptNumber}</span>
        </div>
        <div className="flex justify-between gap-3">
          <span>Date</span>
          <span>{new Date(issuedAt).toLocaleString()}</span>
        </div>
        {customerName ? (
          <div className="flex justify-between gap-3">
            <span>Customer</span>
            <span>{customerName}</span>
          </div>
        ) : null}
        {customerMobile ? (
          <div className="flex justify-between gap-3">
            <span>Mobile</span>
            <span>{customerMobile}</span>
          </div>
        ) : null}
        {paymentMethod ? (
          <div className="flex justify-between gap-3">
            <span>Method</span>
            <span>{paymentMethod}</span>
          </div>
        ) : null}
      </div>

      <div className="my-3 text-center text-xs tracking-[0.18em] text-slate-500">
        ******************************
      </div>
      <div className="mb-2 flex justify-between text-sm font-bold">
        <span>Description</span>
        <span>Price</span>
      </div>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id}>
            <div className="truncate text-sm">{item.product.name}</div>
            <div className="flex justify-between text-xs text-slate-500">
              <span>
                {item.quantity} x {formatCurrencyAmount(item.unitPrice, defaultSystemCurrency)}
              </span>
              <span>{formatCurrencyAmount(item.subtotal, defaultSystemCurrency)}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="my-3 text-center text-xs tracking-[0.18em] text-slate-500">
        ******************************
      </div>
      <div className="space-y-1 text-sm">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatCurrencyAmount(subtotal, defaultSystemCurrency)}</span>
        </div>
        {discount > 0 ? (
          <div className="flex justify-between">
            <span>Discount</span>
            <span>{formatCurrencyAmount(discount, defaultSystemCurrency)}</span>
          </div>
        ) : null}
        <div className="flex items-end justify-between">
          <span className="text-[18px] font-bold">Total</span>
          <span className="text-[24px] font-bold">
            {formatCurrencyAmount(totalAmount, defaultSystemCurrency)}
          </span>
        </div>
      </div>

      <div className="my-3 text-center text-xs tracking-[0.18em] text-slate-500">
        ******************************
      </div>
      <div className="text-center text-xl font-bold tracking-[0.2em]">THANK YOU!</div>
      <div className="mx-auto mt-4 h-10 w-[180px] bg-[repeating-linear-gradient(90deg,#222_0px,#222_2px,transparent_2px,transparent_4px,#222_4px,#222_5px,transparent_5px,transparent_8px)]" />
    </div>
  );
};

export default ReceiptPaperPreview;
