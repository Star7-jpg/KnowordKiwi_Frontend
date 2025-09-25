export default function CreateBlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main className="max-w-4xl mx-auto p-4">{children}</main>;
}
