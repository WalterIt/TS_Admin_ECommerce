"use client";
import { Plus } from "lucide-react";
import Heading from "./ui/Heading";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { useParams, useRouter } from "next/navigation";
import {
  ProductColumns,
  columns,
} from "@/app/(dashboard)/[storeId]/(routes)/products/Columns";
import { DataTable } from "./ui/DataTable";
import ApiList from "./ui/ApiList";

interface ProductClientProps {
  data: ProductColumns[];
}

const ProductClient: React.FC<ProductClientProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Products (${data.length})`}
          description="Manage Products for your Store."
        />
        <Button onClick={() => router.push(`/${params.storeId}/products/new`)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
      <Heading title="Product APIs" description="APIs calls for Products." />
      <Separator />
      <ApiList entityName="products" entityIdName="productId" />
    </>
  );
};

export default ProductClient;
