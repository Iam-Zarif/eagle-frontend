"use client";

import { Button } from "@/components/ui/button";

type DeleteConfirmationModalProps = {
  isOpen: boolean;
  deleteLoading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
};

export function DeleteConfirmationModal({
  isOpen,
  deleteLoading = false,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Yes",
  cancelText = "Cancel",
}: DeleteConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-gray-900/80 backdrop-blur-md rounded-xl shadow-2xl p-6 border border-gray-700/50">
        <h3 className="text-xl lg:text-2xl font-bold text-gray-100 mb-4">{title}</h3>
        <p className="text-gray-300 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <Button
            variant="ghost"
            onClick={onClose}
            className="bg-gray-800/50 hover:bg-gray-700/60 cursor-pointer hover:text-white text-gray-200 py-3 px-6"
            disabled={deleteLoading}
          >
            {cancelText}
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-red-600/80 hover:bg-red-500/90 cursor-pointer text-white py-3 px-6"
            disabled={deleteLoading}
          >
            {deleteLoading ? "Deleting..." : confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
