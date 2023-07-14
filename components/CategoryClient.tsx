"use client";
import { Plus } from "lucide-react";
import Heading from "./ui/Heading";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { useParams, useRouter } from "next/navigation";
import { DataTable } from "./ui/DataTable";
import ApiList from "./ui/ApiList";
import {
  CategoryColumns,
  columns,
} from "@/app/(dashboard)/[storeId]/(routes)/categories/Columns";

interface CategoryClientProps {
  data: CategoryColumns[];
}

const CategoryClient: React.FC<CategoryClientProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Categories (${data.length})`}
          description="Manage Categories for your Store."
        />
        <Button
          onClick={() => router.push(`/${params.storeId}/categories/new`)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
      <Heading
        title="Categories APIs"
        description="APIs calls for Categories."
      />
      <Separator />
      <ApiList entityName="categories" entityIdName="categoryId" />
    </>
  );
};

export default CategoryClient;
