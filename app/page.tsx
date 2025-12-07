"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import {
  addProduct,
  updateProduct,
  deleteProduct,
  subscribeProducts,
} from "@/store/slices/productSlice";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { ProductsTable } from "@/components/reUsable/ProductsTable";
import { AddProductModal } from "@/components/reUsable/AddProductModal";
import { toast, Toaster } from "sonner";
import { ArrowRight } from "lucide-react";

export default function ProductsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { products, fetchLoading, updateLoading, deleteLoading } = useSelector(
    (state: RootState) => state.product
  );

  const [isModalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const unsubscribe = dispatch(subscribeProducts());
    return () => unsubscribe && unsubscribe();
  }, [dispatch]);

  const onOpenAdd = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const onEdit = (product: Product) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  const onSubmit = async (values: Partial<Product>) => {
    setSubmitting(true);
    try {
      if (editingProduct?.id) {
        await dispatch(
          updateProduct({ id: editingProduct.id, data: values })
        ).unwrap();
        toast.success("Product updated");
      } else {
        await dispatch(addProduct(values)).unwrap();
        toast.success("Product added");
      }
      setModalOpen(false);
    } catch (err: unknown) {
      console.error(err);
      toast.error("Failed to save product");
    } finally {
      setSubmitting(false);
    }
  };

  const onToggleStatus = async (product: Product) => {
    if (!product.id) return;
    try {
      await dispatch(
        updateProduct({ id: product.id, data: { status: !product.status } })
      ).unwrap();
      toast.success("Status updated");
    } catch (err: unknown) {
      toast.error("Failed to update status");
      console.error(err);
    }
  };

  const onDelete = async (id: string) => {
    try {
      await dispatch(deleteProduct(id)).unwrap();
      toast.success("Product deleted");
    } catch (err: unknown) {
      toast.error("Failed to delete product");
      console.error(err);
    }
  };

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto">
      <Toaster />
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <div className="flex items-center gap-2">
          <h1 className="text-xl lg:text-3xl font-semibold lg:font-bold text-gray-100">
            Products
          </h1>
          <span className="text-gray-400 lg:text-xl">
            (Total: {products.length})
          </span>
        </div>
        <Button className="cursor-pointer" onClick={onOpenAdd}>
          Add Product
        </Button>
      </div>
      {products.length > 0 && (
        <p className="flex text-gray-400 text-sm font-light my-3 animate-pulse md:hidden items-center gap-1">
          Scroll <ArrowRight size={16} />
        </p>
      )}

      <ProductsTable
        products={products}
        fetchLoading={fetchLoading}
        updateLoading={updateLoading}
        deleteLoading={deleteLoading}
        onEdit={onEdit}
        onToggleStatus={onToggleStatus}
        onDelete={onDelete}
      />

      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        product={editingProduct}
        submitting={submitting}
        onSubmit={onSubmit}
      />
    </div>
  );
}
