"use client";
import Heading from "./ui/Heading";
import { Separator } from "./ui/separator";
import {
  OrderColumns,
  columns,
} from "@/app/(dashboard)/[storeId]/(routes)/orders/Columns";
import { DataTable } from "./ui/DataTable";

interface OrderClientProps {
  data: OrderColumns[];
}

const OrderClient: React.FC<OrderClientProps> = ({ data }) => {
  return (
    <>
      <Heading
        title={`Orders (${data.length})`}
        description="Manage Orders for your Store."
      />

      <Separator />
      <DataTable searchKey="products" columns={columns} data={data} />
    </>
  );
};

export default OrderClient;
