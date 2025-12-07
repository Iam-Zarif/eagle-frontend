"use client";

import { useCallback, useMemo, useState } from "react";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { DeleteConfirmationModal } from "./DeleteConfirmationModal";

type ProductsTableProps = {
  products: Product[];
  fetchLoading: boolean;
  deleteLoading: boolean;
  updateLoading: boolean;
  onEdit: (product: Product) => void;
  onToggleStatus: (product: Product) => Promise<void>; 
  onDelete: (id: string) => void;
};

export function ProductsTable({
  products,
  onEdit,
  onToggleStatus,
  fetchLoading,
  deleteLoading,
  onDelete,
}: ProductsTableProps) {
  const columnHelper = createColumnHelper<Product>();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [updatingIds, setUpdatingIds] = useState<string[]>([]);

  const handleDelete = (id: string) => setDeleteId(id);
  const confirmDelete = async () => {
    if (!deleteId) return;
    await onDelete(deleteId);
    setDeleteId(null);
  };

  const handleToggleStatus = useCallback(
    async (product: Product) => {
      if (!product.id) return;
      setUpdatingIds((prev) => [...prev, product.id]);
      try {
        await onToggleStatus(product);
      } finally {
        setUpdatingIds((prev) => prev.filter((id) => id !== product.id));
      }
    },
    [onToggleStatus]
  );

  const columns = useMemo(
    () => [
      columnHelper.accessor("name", { header: "Name" }),
      columnHelper.accessor("description", {
        header: "Description",
        cell: (info) => {
          const value = info.getValue() as string;
          return (
            <div className="text-left w-full text-nowrap">
              {value?.length > 50 ? value.slice(0, 40) + "..." : value}
            </div>
          );
        },
      }),
      columnHelper.accessor("price", {
        header: "Price",
        cell: (info) => (
          <div className=" w-full">${info.getValue()}</div>
        ),
      }),
      columnHelper.accessor("quantity", {
        header: "Qty",
        cell: (info) => (
          <div className=" w-full">{info.getValue()}</div>
        ),
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: (info) => (
          <div className=" w-full">
            {info.getValue() ? "Active" : "Inactive"}
          </div>
        ),
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const product = row.original;
          const isUpdating = updatingIds.includes(product.id!);

          return (
            <div className="flex justify-end gap-2 min-w-[180px]">
              <Button
                size="sm"
                className="cursor-pointer"
                variant="ghost"
                onClick={() => onEdit(product)}
              >
                Edit
              </Button>
              <Button
                size="sm"
                className="cursor-pointer"
                variant="ghost"
                disabled={isUpdating}
                onClick={() => handleToggleStatus(product)}
              >
                {isUpdating
                  ? "Updating..."
                  : product.status
                  ? "Disable"
                  : "Enable"}
              </Button>
              <Button
                size="sm"
                className="cursor-pointer"
                variant="destructive"
                onClick={() => handleDelete(product.id!)}
              >
                Delete
              </Button>
            </div>
          );
        },
      }),
    ],
    [columnHelper, updatingIds, handleToggleStatus, onEdit]
  );

  const table = useReactTable({
    data: products ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <Card className="bg-gray-900/50 rounded-xl border py-0 border-gray-700  overflow-x-auto">
        <CardContent className="p-0">
          <table className="w-full text-sm text-gray-300 border-collapse">
            <thead className="bg-gray-800/60 text-gray-400">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className={`py-3 px-4 ${
                        header.id === "actions" ? "text-right" : "text-left"
                      }`}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-gray-700">
              {fetchLoading ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="py-6 text-center text-gray-400"
                  >
                    Loading products...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="py-6 text-center text-gray-500"
                  >
                    No products yet
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-800/40 transition">
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className={`text-nowrap ${
                          cell.column.id === "actions" ? "text-right" : ""
                        } py-3 px-4`}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <DeleteConfirmationModal
        isOpen={!!deleteId}
        deleteLoading={deleteLoading}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />
    </>
  );
}
