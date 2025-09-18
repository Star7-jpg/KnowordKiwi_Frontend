// import { format } from "date-fns";
// import { es } from "date-fns/locale";

interface BlogPreviewProps {
  title: string;
  content: string;
}

export default function BlogPreview({ title, content }: BlogPreviewProps) {
  // Fecha simulada para la vista previa
  const previewDate = new Date();

  return (
    <div className="bg-bg-gray border border-gray-700 rounded-md p-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">
          {title || "Título del blog"}
        </h1>
        <div className="flex items-center text-gray-400 text-sm">
          <span>Por Autor del Blog</span>
          <span className="mx-2">•</span>
          <time dateTime={previewDate.toISOString()}>
            {/* {format(previewDate, "d 'de' MMMM 'de' yyyy", { locale: es })} */}
          </time>
        </div>
      </header>

      <div
        className="prose prose-invert max-w-none"
        dangerouslySetInnerHTML={{
          __html: content || "<p>Contenido del blog aparecerá aquí...</p>",
        }}
      />
    </div>
  );
}
