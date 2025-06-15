import { Button } from "@headlessui/react";

type ErrorModalProps = {
  message: string;
  onClose: () => void;
  onRetry: () => void;
};
export default function ErrorModal({
  message,
  onClose,
  onRetry,
}: ErrorModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-gray-800 rounded-lg shadow-xl p-6 max-w-sm mx-auto text-white">
        <h3 className="text-2xl font-bold text-text-error mb-4 text-center">
          ¡Upps! 😢
        </h3>
        <p className="mb-6">{message}</p>
        <div className="flex justify-end space-x-4">
          <Button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700"
          >
            Cerrar
          </Button>
          <Button
            onClick={onRetry}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-hover"
          >
            Reintentar
          </Button>
        </div>
      </div>
    </div>
  );
}
