import BlogLayout from '../components/BlogLayout';

export default function EditBlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <BlogLayout>{children}</BlogLayout>;
}
