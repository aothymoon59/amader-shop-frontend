import { useMemo, useState } from "react";
import { Button, Form, Input, InputNumber, Modal, Select, Space, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { MapPinned, Pencil, Plus } from "lucide-react";

import CustomTable from "@/components/shared/table/CustomTable";
import { useSystemCurrency } from "@/hooks/useSystemCurrency";
import { toast } from "@/hooks/use-toast";
import {
  type DeliveryZone,
  useCreateDeliveryZoneMutation,
  useGetManagedDeliveryZonesQuery,
  useUpdateDeliveryZoneMutation,
} from "@/redux/features/generalApi/deliveryZonesApi";
import { defaultSystemCurrency } from "@/redux/features/generalApi/systemSettingsApi";
import { formatCurrencyAmount } from "@/utils/currency";

type DeliveryZoneFormValues = {
  name: string;
  normalCharge: number;
  expressCharge: number;
  freeDeliveryThreshold?: number | null;
  isActive: boolean;
};

const DeliveryZonesManagementPage = () => {
  const [form] = Form.useForm<DeliveryZoneFormValues>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingZone, setEditingZone] = useState<DeliveryZone | null>(null);
  const { currency = defaultSystemCurrency } = useSystemCurrency();
  const { data, isLoading, refetch } = useGetManagedDeliveryZonesQuery();
  const [createDeliveryZone, { isLoading: isCreating }] = useCreateDeliveryZoneMutation();
  const [updateDeliveryZone, { isLoading: isUpdating }] = useUpdateDeliveryZoneMutation();

  const deliveryZones = data?.data || [];

  const openCreateModal = () => {
    setEditingZone(null);
    form.resetFields();
    form.setFieldsValue({
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (zone: DeliveryZone) => {
    setEditingZone(zone);
    form.setFieldsValue({
      name: zone.name,
      normalCharge: zone.normalCharge,
      expressCharge: zone.expressCharge,
      freeDeliveryThreshold: zone.freeDeliveryThreshold ?? undefined,
      isActive: zone.isActive,
    });
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setEditingZone(null);
    form.resetFields();
  };

  const handleSubmit = async (values: DeliveryZoneFormValues) => {
    try {
      if (editingZone) {
        await updateDeliveryZone({
          id: editingZone.id,
          payload: values,
        }).unwrap();
        toast({
          title: "Delivery zone updated",
          description: `${values.name} has been updated successfully.`,
        });
      } else {
        await createDeliveryZone(values).unwrap();
        toast({
          title: "Delivery zone created",
          description: `${values.name} has been added successfully.`,
        });
      }

      handleClose();
      void refetch();
    } catch (error: unknown) {
      const message =
        typeof error === "object" &&
        error !== null &&
        "data" in error &&
        typeof error.data === "object" &&
        error.data !== null &&
        "message" in error.data
          ? String(error.data.message)
          : "Unable to save delivery zone right now.";

      toast({
        title: "Save failed",
        description: message,
        variant: "destructive",
      });
    }
  };

  const columns = useMemo<ColumnsType<DeliveryZone>>(
    () => [
      {
        title: "Zone",
        key: "zone",
        render: (_, zone) => (
          <div>
            <div className="font-semibold">{zone.name}</div>
            <div className="text-xs text-muted-foreground">{zone.slug}</div>
          </div>
        ),
      },
      {
        title: "Normal",
        key: "normalCharge",
        render: (_, zone) => formatCurrencyAmount(zone.normalCharge, currency),
      },
      {
        title: "Express",
        key: "expressCharge",
        render: (_, zone) => formatCurrencyAmount(zone.expressCharge, currency),
      },
      {
        title: "Free Delivery",
        key: "freeDeliveryThreshold",
        render: (_, zone) =>
          zone.freeDeliveryThreshold
            ? formatCurrencyAmount(zone.freeDeliveryThreshold, currency)
            : "Not set",
      },
      {
        title: "Status",
        key: "status",
        render: (_, zone) => (
          <Tag color={zone.isActive ? "green" : "red"}>
            {zone.isActive ? "Active" : "Inactive"}
          </Tag>
        ),
      },
      {
        title: "Actions",
        key: "actions",
        render: (_, zone) => (
          <Button type="text" icon={<Pencil size={16} />} onClick={() => openEditModal(zone)}>
            Edit
          </Button>
        ),
      },
    ],
    [currency]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-primary">
            Fulfillment Setup
          </p>
          <h1 className="mt-2 text-3xl font-bold">Delivery Zones</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Define delivery areas, normal and express charges, free-shipping thresholds, and availability.
          </p>
        </div>
        <Button type="primary" icon={<Plus size={16} />} onClick={openCreateModal}>
          Add Delivery Zone
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <div className="rounded-2xl border bg-card p-4">
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Active Zones</div>
          <div className="mt-2 text-2xl font-bold">
            {deliveryZones.filter((zone) => zone.isActive).length}
          </div>
        </div>
        <div className="rounded-2xl border bg-card p-4">
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Express Ready</div>
          <div className="mt-2 text-2xl font-bold">
            {deliveryZones.filter((zone) => zone.expressCharge > 0).length}
          </div>
        </div>
        <div className="rounded-2xl border bg-card p-4">
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Configured Zones</div>
          <div className="mt-2 flex items-center gap-2 text-2xl font-bold">
            <MapPinned className="h-5 w-5 text-primary" />
            {deliveryZones.length}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border bg-card p-3">
        <CustomTable<DeliveryZone>
          columns={columns}
          dataSource={deliveryZones}
          rowKey="id"
          isPagination={false}
          loading={isLoading}
        />
      </div>

      <Modal
        open={isModalOpen}
        title={editingZone ? "Edit Delivery Zone" : "Create Delivery Zone"}
        onCancel={handleClose}
        onOk={() => form.submit()}
        okText={editingZone ? "Update Zone" : "Create Zone"}
        okButtonProps={{ loading: isCreating || isUpdating }}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Zone Name"
            name="name"
            rules={[{ required: true, message: "Please enter zone name" }]}
          >
            <Input placeholder="Dhaka City" />
          </Form.Item>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Form.Item
              label="Normal Charge"
              name="normalCharge"
              rules={[{ required: true, message: "Please enter normal charge" }]}
            >
              <InputNumber min={0} className="w-full" />
            </Form.Item>
            <Form.Item
              label="Express Charge"
              name="expressCharge"
              rules={[{ required: true, message: "Please enter express charge" }]}
            >
              <InputNumber min={0} className="w-full" />
            </Form.Item>
          </div>
          <Form.Item label="Free Delivery Threshold" name="freeDeliveryThreshold">
            <InputNumber min={0} className="w-full" placeholder="Optional" />
          </Form.Item>
          <Form.Item label="Status" name="isActive" rules={[{ required: true }]}>
            <Select
              options={[
                { value: true, label: "Active" },
                { value: false, label: "Inactive" },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DeliveryZonesManagementPage;
