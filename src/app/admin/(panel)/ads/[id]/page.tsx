import AdEditor from "@/components/admin/AdEditor";

export default async function EditAdPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AdEditor adId={id} />;
}
