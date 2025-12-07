"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type FormValues = {
  name: string;
  description?: string;
  price: number;
  quantity: number;
  status: boolean;
};

type AddProductModalProps = {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
  submitting: boolean;
  onSubmit: (values: FormValues) => void;
};

export function AddProductModal({
  isOpen,
  onClose,
  product,
  onSubmit,
  submitting,
}: AddProductModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: product ?? {
      name: "",
      description: "",
      price: 0,
      quantity: 0,
      status: true,
    },
  });

  React.useEffect(() => {
    reset(
      product ?? {
        name: "",
        description: "",
        price: 0,
        quantity: 0,
        status: true,
      }
    );
  }, [product, reset]);

  if (!isOpen) return null;

  const handleFormSubmit = async (values: FormValues) => {
    await onSubmit(values);
    reset({ name: "", description: "", price: 0, quantity: 0, status: true });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-gray-900/80 backdrop-blur-md rounded-xl shadow-2xl p-6 border border-gray-700/50">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-100">
            {product ? "Edit Product" : "Add Product"}
          </h3>
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-gray-400 cursor-pointer"
          >
            Close
          </Button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
          <div className="flex flex-col gap-1">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Enter product name"
              {...register("name", { required: true })}
              className="bg-gray-800/70 text-gray-100 border border-gray-600 mt-2 placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500 py-3"
            />
            {errors.name && (
              <p className="text-red-400 text-sm">Name is required</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="Enter product description"
              {...register("description")}
              className="bg-gray-800/70 text-gray-100 border border-gray-600 mt-2 placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500 py-3"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                placeholder="0.00"
                {...register("price", { valueAsNumber: true })}
                className="bg-gray-800/70 text-gray-100 border border-gray-600 mt-2 placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500 py-3"
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                placeholder="0"
                {...register("quantity", { valueAsNumber: true })}
                className="bg-gray-800/70 text-gray-100 border border-gray-600 mt-2 placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500 py-3"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 mt-2">
            <input
              type="checkbox"
              id="status"
              {...register("status")}
              className="form-checkbox h-5 w-5 text-indigo-500 bg-gray-800 border-gray-600 rounded focus:ring-indigo-500"
            />
            <Label htmlFor="status" className="text-gray-100">
              Active
            </Label>
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <Button
              variant="ghost"
              onClick={onClose}
              className="bg-gray-800/50 hover:bg-gray-700/60 hover:text-white cursor-pointer text-gray-200 py-3 px-6"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="bg-indigo-600/80 hover:bg-indigo-500/90 text-white cursor-pointer py-3 px-6"
            >
              {submitting ? "Saving..." : product ? "Update" : "Add"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
