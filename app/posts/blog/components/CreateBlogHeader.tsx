import { Button } from "@headlessui/react";
import { Eye, EyeOff } from "lucide-react";

interface CreateBlogHeaderProps {
  onSave: () => void;
  onSubmit: () => void;
  onCancel: () => void;
  onTogglePreview: () => void;
  isPreviewMode: boolean;
}

export default function CreateBlogHeader({
  onSave,
  onCancel,
  onSubmit,
  onTogglePreview,
  isPreviewMode,
}: CreateBlogHeaderProps) {
  return (
    <header className="flex items-center justify-between">
      <h1 className="text-2xl font-bold text-white">Crear nuevo blog</h1>
      <div className="flex items-center gap-4">
        <Button
          onClick={onCancel}
          className="text-gray-400 hover:text-white transition-colors"
        >
          Cancelar
        </Button>
        <Button
          onClick={onTogglePreview}
          className="flex items-center gap-2 px-4 py-2 border border-gray-600 text-white rounded-md hover:border-gray-500 transition-colors font-semibold"
        >
          {isPreviewMode ? (
            <>
              <EyeOff className="size-4" />
              Editar
            </>
          ) : (
            <>
              <Eye className="size-4" />
              Vista previa
            </>
          )}
        </Button>
        <Button
          onClick={onSave}
          className="px-4 py-2 border border-primary text-white rounded-md hover:border-primary-hover  transition-colors font-semibold"
        >
          Guardar borrador
        </Button>
        <Button
          onClick={onSubmit}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover transition-colors font-semibold"
        >
          Publicar
        </Button>
      </div>
    </header>
  );
}
