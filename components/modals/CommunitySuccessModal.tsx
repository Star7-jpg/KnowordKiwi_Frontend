import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Description,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { useRouter } from "next/navigation";

interface CommunitySuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
  communityId?: string;
}

export default function CommunitySuccessModal({
  isOpen,
  onClose,
  message,
  communityId,
}: CommunitySuccessModalProps) {
  const router = useRouter();

  const handleGoToCommunity = () => {
    router.push(`/communities/community/${communityId}`);
    onClose();
  };

  return (
    <Transition show={isOpen}>
      <Dialog onClose={onClose} className="relative z-50">
        {/* Fondo oscuro (backdrop) */}
        <TransitionChild
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60" aria-hidden="true" />
        </TransitionChild>

        {/* Contenedor del modal centrado */}
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <TransitionChild
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <DialogPanel className="bg-gray-800 rounded-lg shadow-xl p-6 max-w-sm mx-auto text-white">
              <div className="flex flex-col items-center">
                <DialogTitle className="text-2xl font-bold text-terciary mb-4 text-center">
                  Comunidad Creada
                </DialogTitle>

                <Description className="text-md text-gray-200 mb-6 text-center">
                  {message}
                </Description>
                <div className="flex gap-4">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 bg-primary rounded hover:bg-primary-hover text-white"
                  >
                    OK, lo he entendido
                  </button>
                  <button
                    onClick={handleGoToCommunity}
                    className="px-4 py-2 bg-secondary text-white rounded hover:bg-secondary-hover"
                  >
                    Muestrame mi comunidad
                  </button>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
}
