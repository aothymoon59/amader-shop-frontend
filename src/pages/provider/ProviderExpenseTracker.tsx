import { useMemo, useState } from "react";
import dayjs, { type Dayjs } from "dayjs";
import {
  Button,
  Card,
  Popconfirm,
  DatePicker,
  Drawer,
  Form,
  Grid,
  Input,
  InputNumber,
  Modal,
  Radio,
  Select,
  Space,
  Spin,
  Statistic,
  Table,
  Tag,
  Typography,
} from "antd";
import { Eye, PencilLine } from "lucide-react";

import DashboardLayout from "@/components/layouts/DashboardLayout";
import { toast } from "@/hooks/use-toast";
import { useSystemCurrency } from "@/hooks/useSystemCurrency";
import { defaultSystemCurrency } from "@/redux/features/generalApi/systemSettingsApi";
import {
  type ManualFinanceDaySummary,
  type ManualFinanceEntry,
  type ManualFinanceEntryPayload,
  type ManualFinanceEntryType,
  useCreateManualFinanceEntryMutation,
  useDeleteManualFinanceEntryMutation,
  useGetManualFinanceDailyQuery,
  useGetManualFinanceDayDetailsQuery,
  useUpdateManualFinanceEntryMutation,
} from "@/redux/features/manual-finance/manualFinanceApi";
import { formatCurrencyAmount } from "@/utils/currency";

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

type EntryFormValues = {
  entryType: ManualFinanceEntryType;
  title: string;
  amount: number;
  note?: string;
  entryDate: Dayjs;
};

const monthOptions = [
  { label: "January", value: 1 },
  { label: "February", value: 2 },
  { label: "March", value: 3 },
  { label: "April", value: 4 },
  { label: "May", value: 5 },
  { label: "June", value: 6 },
  { label: "July", value: 7 },
  { label: "August", value: 8 },
  { label: "September", value: 9 },
  { label: "October", value: 10 },
  { label: "November", value: 11 },
  { label: "December", value: 12 },
];

const currentYear = new Date().getFullYear();
const yearOptions = Array.from({ length: 7 }, (_, index) => ({
  label: String(currentYear - index),
  value: currentYear - index,
}));

const getApiErrorMessage = (error: unknown, fallback: string) => {
  if (
    typeof error === "object" &&
    error !== null &&
    "data" in error &&
    typeof error.data === "object" &&
    error.data !== null &&
    "message" in error.data
  ) {
    return String(error.data.message);
  }

  return fallback;
};

const mapFormValuesToPayload = (
  values: EntryFormValues,
): ManualFinanceEntryPayload => ({
  entryType: values.entryType,
  title: values.title.trim(),
  amount: Number(values.amount),
  note: values.note?.trim() || "",
  entryDate: values.entryDate.format("YYYY-MM-DD"),
});

const ProviderExpenseTracker = () => {
  const screens = Grid.useBreakpoint();
  const isMobile = !screens.md;
  const isTablet = screens.md && !screens.xl;
  const { currency = defaultSystemCurrency } = useSystemCurrency();
  const [entryForm] = Form.useForm<EntryFormValues>();
  const [editForm] = Form.useForm<EntryFormValues>();
  const [view, setView] = useState<"monthly" | "yearly">("monthly");
  const [year, setYear] = useState<number>(currentYear);
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [page, setPage] = useState<number>(1);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [editingEntry, setEditingEntry] = useState<ManualFinanceEntry | null>(
    null,
  );

  const queryParams = useMemo(
    () => ({
      view,
      year,
      ...(view === "monthly" ? { month } : {}),
      page,
      limit: 10,
    }),
    [month, page, view, year],
  );

  const { data, isLoading, isFetching } =
    useGetManualFinanceDailyQuery(queryParams);
  const {
    data: dayDetailsData,
    isLoading: isDayLoading,
    isFetching: isDayFetching,
  } = useGetManualFinanceDayDetailsQuery(selectedDate ?? "", {
    skip: !selectedDate,
  });
  const [createEntry, { isLoading: isCreating }] =
    useCreateManualFinanceEntryMutation();
  const [deleteEntry, { isLoading: isDeleting }] =
    useDeleteManualFinanceEntryMutation();
  const [updateEntry, { isLoading: isUpdating }] =
    useUpdateManualFinanceEntryMutation();

  const summary = data?.data.summary;
  const dayRows = data?.data.days ?? [];
  const meta = data?.meta;
  const dayDetails = dayDetailsData?.data;

  const handleCreateEntry = async (values: EntryFormValues) => {
    try {
      await createEntry(mapFormValuesToPayload(values)).unwrap();
      entryForm.setFieldsValue({
        entryType: values.entryType,
        entryDate: values.entryDate,
        title: "",
        amount: undefined,
        note: "",
      });
      toast({
        title: "Entry saved",
        description: "The daily summary has been recalculated.",
      });
    } catch (error) {
      toast({
        title: "Unable to save entry",
        description: getApiErrorMessage(
          error,
          "Please try again after checking the entry information.",
        ),
        variant: "destructive",
      });
    }
  };

  const handleEditClick = (entry: ManualFinanceEntry) => {
    setEditingEntry(entry);
    editForm.setFieldsValue({
      entryType: entry.entryType,
      title: entry.title,
      amount: entry.amount,
      note: entry.note || "",
      entryDate: dayjs(entry.entryDate),
    });
  };

  const handleUpdateEntry = async (values: EntryFormValues) => {
    if (!editingEntry) {
      return;
    }

    try {
      await updateEntry({
        id: editingEntry.id,
        body: mapFormValuesToPayload(values),
      }).unwrap();
      setEditingEntry(null);
      toast({
        title: "Entry updated",
        description: "The day totals were refreshed with your changes.",
      });
    } catch (error) {
      toast({
        title: "Unable to update entry",
        description: getApiErrorMessage(
          error,
          "Please review the updated values and try again.",
        ),
        variant: "destructive",
      });
    }
  };

  const handleDeleteEntry = async (entryId: string) => {
    try {
      await deleteEntry(entryId).unwrap();
      toast({
        title: "Entry deleted",
        description: "The daily summary has been recalculated.",
      });
    } catch (error) {
      toast({
        title: "Unable to delete entry",
        description: getApiErrorMessage(
          error,
          "Please try again in a moment.",
        ),
        variant: "destructive",
      });
    }
  };

  const summaryCards = [
    {
      title: "Total Expense",
      value: summary?.totalExpense || 0,
      valueStyle: { color: "#b42318" },
    },
    {
      title: "Total Income",
      value: summary?.totalIncome || 0,
      valueStyle: { color: "#027a48" },
    },
    {
      title: "Balance",
      value: summary?.balance || 0,
      valueStyle: {
        color: (summary?.balance || 0) >= 0 ? "#0f766e" : "#b42318",
      },
    },
  ];

  const dailyColumns = useMemo(
    () =>
      isMobile
        ? [
            {
              title: view === "yearly" ? "Month" : "Day",
              dataIndex: "label",
              key: "label",
              render: (value: string, record: ManualFinanceDaySummary) => (
                <div className="space-y-1">
                  <div className="font-medium">{value}</div>
                  <div className="text-xs text-muted-foreground">
                    {record.entryCount} entries
                  </div>
                  <div className="flex flex-wrap gap-1">
                    <Tag color="green">{record.incomeCount} income</Tag>
                    <Tag color="red">{record.expenseCount} expense</Tag>
                  </div>
                </div>
              ),
            },
            {
              title: "Totals",
              key: "totals",
              render: (_: unknown, record: ManualFinanceDaySummary) => (
                <div className="space-y-1 text-right">
                  <div className="text-xs text-muted-foreground">
                    In {formatCurrencyAmount(Number(record.totalIncome || 0), currency)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Out {formatCurrencyAmount(Number(record.totalExpense || 0), currency)}
                  </div>
                  <Text
                    className={
                      record.balance >= 0 ? "text-emerald-600" : "text-rose-600"
                    }
                  >
                    {formatCurrencyAmount(Number(record.balance || 0), currency)}
                  </Text>
                </div>
              ),
            },
            ...(view === "monthly"
              ? [
                  {
                    title: "",
                    key: "action",
                    width: 84,
                    render: (_: unknown, record: ManualFinanceDaySummary) => (
                      <Button
                        type="link"
                        className="px-0"
                        icon={<Eye className="h-4 w-4" />}
                        onClick={() => setSelectedDate(record.date)}
                      >
                        View
                      </Button>
                    ),
                  },
                ]
              : []),
          ]
        : [
            {
              title: view === "yearly" ? "Month" : "Date",
              dataIndex: "label",
              key: "label",
            },
            {
              title: "Income",
              dataIndex: "totalIncome",
              key: "totalIncome",
              render: (value: number) =>
                formatCurrencyAmount(Number(value || 0), currency),
            },
            {
              title: "Expense",
              dataIndex: "totalExpense",
              key: "totalExpense",
              render: (value: number) =>
                formatCurrencyAmount(Number(value || 0), currency),
            },
            {
              title: "Balance",
              dataIndex: "balance",
              key: "balance",
              render: (value: number) => (
                <Text
                  className={
                    value >= 0 ? "text-emerald-600" : "text-rose-600"
                  }
                >
                  {formatCurrencyAmount(Number(value || 0), currency)}
                </Text>
              ),
            },
            {
              title: "Entries",
              key: "entries",
              render: (_: unknown, record: ManualFinanceDaySummary) => (
                <Space size="small" wrap>
                  <Tag color="green">{record.incomeCount} income</Tag>
                  <Tag color="red">{record.expenseCount} expense</Tag>
                </Space>
              ),
            },
            ...(view === "monthly"
              ? [
                  {
                    title: "Action",
                    key: "action",
                    render: (_: unknown, record: ManualFinanceDaySummary) => (
                      <Button
                        icon={<Eye className="h-4 w-4" />}
                        onClick={() => setSelectedDate(record.date)}
                      >
                        View
                      </Button>
                    ),
                  },
                ]
              : []),
          ],
    [currency, isMobile, view],
  );

  const detailColumns = useMemo(
    () =>
      isMobile
        ? [
            {
              title: "Entry",
              key: "entry",
              render: (_: unknown, record: ManualFinanceEntry) => (
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Tag color={record.entryType === "INCOME" ? "green" : "red"}>
                      {record.entryType === "INCOME" ? "Income" : "Expense"}
                    </Tag>
                    <span className="font-medium">{record.title}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {record.note || "No note"}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {dayjs(record.updatedAt).format("DD MMM YYYY, h:mm A")}
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <Text>
                      {formatCurrencyAmount(Number(record.amount || 0), currency)}
                    </Text>
                    <Button
                      type="link"
                      className="px-0"
                      icon={<PencilLine className="h-4 w-4" />}
                      onClick={() => handleEditClick(record)}
                    >
                      Edit
                    </Button>
                    <Popconfirm
                      title="Delete this entry?"
                      description="This will remove the entry and update the totals."
                      okText="Delete"
                      cancelText="Cancel"
                      okButtonProps={{ danger: true, loading: isDeleting }}
                      onConfirm={() => handleDeleteEntry(record.id)}
                    >
                      <Button
                        type="link"
                        danger
                        className="px-0"
                      >
                        Delete
                      </Button>
                    </Popconfirm>
                  </div>
                </div>
              ),
            },
          ]
        : [
            {
              title: "Type",
              dataIndex: "entryType",
              key: "entryType",
              render: (value: ManualFinanceEntryType) => (
                <Tag color={value === "INCOME" ? "green" : "red"}>
                  {value === "INCOME" ? "Income" : "Expense"}
                </Tag>
              ),
            },
            {
              title: "Title",
              dataIndex: "title",
              key: "title",
            },
            {
              title: "Note",
              dataIndex: "note",
              key: "note",
              render: (value: string | null) =>
                value || <Text type="secondary">No note</Text>,
            },
            {
              title: "Amount",
              dataIndex: "amount",
              key: "amount",
              render: (value: number) =>
                formatCurrencyAmount(Number(value || 0), currency),
            },
            {
              title: "Updated",
              dataIndex: "updatedAt",
              key: "updatedAt",
              render: (value: string) =>
                dayjs(value).format("DD MMM YYYY, h:mm A"),
            },
            {
              title: "Action",
              key: "action",
              render: (_: unknown, record: ManualFinanceEntry) => (
                <Space>
                  <Button
                    icon={<PencilLine className="h-4 w-4" />}
                    onClick={() => handleEditClick(record)}
                  >
                    Edit
                  </Button>
                  <Popconfirm
                    title="Delete this entry?"
                    description="This will remove the entry and update the totals."
                    okText="Delete"
                    cancelText="Cancel"
                    okButtonProps={{ danger: true, loading: isDeleting }}
                    onConfirm={() => handleDeleteEntry(record.id)}
                  >
                    <Button danger>Delete</Button>
                  </Popconfirm>
                </Space>
              ),
            },
          ],
    [currency, isDeleting, isMobile],
  );

  return (
    <DashboardLayout role="provider">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Title level={isMobile ? 3 : 2} className="!mb-2">
              Expense Tracker
            </Title>
            <Paragraph className="!mb-0 text-muted-foreground">
              Track your manual income and daily expenses here. This page is
              separate from sales, POS, wallet earnings, and reports.
            </Paragraph>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:flex lg:flex-wrap lg:items-end">
            <div className="min-w-0">
              <Text className="mb-1 block text-sm text-muted-foreground">
                View
              </Text>
              <Radio.Group
                className="w-full [&_.ant-radio-button-wrapper]:flex-1 [&_.ant-radio-button-wrapper]:text-center"
                value={view}
                onChange={(event) => {
                  setView(event.target.value);
                  setPage(1);
                }}
              >
                <Radio.Button value="monthly">Monthly</Radio.Button>
                <Radio.Button value="yearly">Yearly</Radio.Button>
              </Radio.Group>
            </div>
            {view === "monthly" ? (
              <div className="min-w-0">
                <Text className="mb-1 block text-sm text-muted-foreground">
                  Month
                </Text>
                <Select
                  value={month}
                  onChange={(value) => {
                    setMonth(value);
                    setPage(1);
                  }}
                  options={monthOptions}
                  className="w-full lg:min-w-[150px]"
                />
              </div>
            ) : null}
            <div className="min-w-0">
              <Text className="mb-1 block text-sm text-muted-foreground">
                Year
              </Text>
              <Select
                value={year}
                onChange={(value) => {
                  setYear(value);
                  setPage(1);
                }}
                options={yearOptions}
                className="w-full lg:min-w-[120px]"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          {summaryCards.map((card) => (
            <Card
              key={card.title}
              bordered={false}
              size={isMobile ? "small" : "default"}
              className="shadow-sm"
            >
              <Statistic
                title={card.title}
                value={card.value}
                valueStyle={card.valueStyle}
                formatter={(value) =>
                  formatCurrencyAmount(Number(value || 0), currency)
                }
              />
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <Card
            bordered={false}
            size={isMobile ? "small" : "default"}
            className="shadow-sm xl:col-span-1"
          >
            <Title level={4}>Add Manual Entry</Title>
            <Paragraph className="text-muted-foreground">
              Add as many income or expense rows as you need for the same day.
            </Paragraph>

            <Form<EntryFormValues>
              form={entryForm}
              layout="vertical"
              initialValues={{
                entryType: "EXPENSE",
                entryDate: dayjs(),
              }}
              onFinish={handleCreateEntry}
            >
              <Form.Item
                label="Entry Type"
                name="entryType"
                rules={[
                  { required: true, message: "Please choose entry type" },
                ]}
              >
                <Select
                  options={[
                    { label: "Expense", value: "EXPENSE" },
                    { label: "Income", value: "INCOME" },
                  ]}
                />
              </Form.Item>
              <Form.Item
                label="Title"
                name="title"
                rules={[{ required: true, message: "Please enter a title" }]}
              >
                <Input placeholder="E.g. Groceries" />
              </Form.Item>
              <Form.Item
                label="Amount"
                name="amount"
                rules={[{ required: true, message: "Please enter amount" }]}
              >
                <InputNumber min={0.01} className="w-full" />
              </Form.Item>
              <Form.Item
                label="Date"
                name="entryDate"
                rules={[{ required: true, message: "Please choose a date" }]}
              >
                <DatePicker className="w-full" format="YYYY-MM-DD" />
              </Form.Item>
              <Form.Item label="Note" name="note">
                <TextArea rows={3} placeholder="Optional note" />
              </Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={isCreating}
              >
                Save Entry
              </Button>
            </Form>
          </Card>

          <Card
            bordered={false}
            size={isMobile ? "small" : "default"}
            className="shadow-sm xl:col-span-2"
          >
            <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <Title level={4} className="!mb-1">
                  Daily Summary
                </Title>
                <Text type="secondary">
                  {summary?.periodLabel || "Selected period"} {" · "}
                  {summary?.totalEntries || 0} entry
                  {summary?.totalEntries === 1 ? "" : "ies"} across{" "}
                  {summary?.totalDays || 0} {view === "yearly" ? "month" : "day"}
                  {summary?.totalDays === 1 ? "" : "s"}
                </Text>
              </div>
            </div>

            {isLoading || isFetching ? (
              <div className="flex min-h-[320px] items-center justify-center">
                <Spin size="large" />
              </div>
            ) : (
              <Table
                size={isMobile ? "small" : "middle"}
                rowKey="date"
                dataSource={dayRows}
                scroll={isMobile ? { x: 560 } : undefined}
                pagination={{
                  current: meta?.page || 1,
                  pageSize: meta?.limit || 10,
                  total: meta?.total || 0,
                  onChange: (nextPage) => setPage(nextPage),
                  showSizeChanger: false,
                  simple: isMobile,
                  size: isMobile ? "small" : "default",
                }}
                columns={dailyColumns}
              />
            )}
          </Card>
        </div>

        <Drawer
          title={dayDetails?.label || "Day Details"}
          open={Boolean(selectedDate)}
          onClose={() => setSelectedDate(null)}
          placement={isMobile ? "bottom" : "right"}
          width={isMobile ? undefined : isTablet ? 620 : 760}
          height={isMobile ? "88vh" : undefined}
        >
          {isDayLoading || isDayFetching ? (
            <div className="flex min-h-[220px] items-center justify-center">
              <Spin size="large" />
            </div>
          ) : dayDetails ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <Card size="small">
                  <Statistic
                    title="Income"
                    value={dayDetails.totals.totalIncome}
                    formatter={(value) =>
                      formatCurrencyAmount(Number(value || 0), currency)
                    }
                  />
                </Card>
                <Card size="small">
                  <Statistic
                    title="Expense"
                    value={dayDetails.totals.totalExpense}
                    formatter={(value) =>
                      formatCurrencyAmount(Number(value || 0), currency)
                    }
                  />
                </Card>
                <Card size="small">
                  <Statistic
                    title="Balance"
                    value={dayDetails.totals.balance}
                    formatter={(value) =>
                      formatCurrencyAmount(Number(value || 0), currency)
                    }
                  />
                </Card>
              </div>

              <Table<ManualFinanceEntry>
                size={isMobile ? "small" : "middle"}
                rowKey="id"
                pagination={false}
                dataSource={dayDetails.entries}
                scroll={isMobile ? { x: 480 } : undefined}
                columns={detailColumns}
              />
            </div>
          ) : null}
        </Drawer>

        <Modal
          title="Update Entry"
          open={Boolean(editingEntry)}
          onCancel={() => setEditingEntry(null)}
          onOk={() => editForm.submit()}
          confirmLoading={isUpdating}
          width={isMobile ? "calc(100vw - 24px)" : 520}
          style={isMobile ? { top: 12 } : undefined}
        >
          <Form<EntryFormValues>
            form={editForm}
            layout="vertical"
            onFinish={handleUpdateEntry}
          >
            <Form.Item
              label="Entry Type"
              name="entryType"
              rules={[{ required: true, message: "Please choose entry type" }]}
            >
              <Select
                options={[
                  { label: "Expense", value: "EXPENSE" },
                  { label: "Income", value: "INCOME" },
                ]}
              />
            </Form.Item>
            <Form.Item
              label="Title"
              name="title"
              rules={[{ required: true, message: "Please enter a title" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Amount"
              name="amount"
              rules={[{ required: true, message: "Please enter amount" }]}
            >
              <InputNumber min={0.01} className="w-full" />
            </Form.Item>
            <Form.Item
              label="Date"
              name="entryDate"
              rules={[{ required: true, message: "Please choose a date" }]}
            >
              <DatePicker className="w-full" format="YYYY-MM-DD" />
            </Form.Item>
            <Form.Item label="Note" name="note">
              <TextArea rows={3} />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default ProviderExpenseTracker;
