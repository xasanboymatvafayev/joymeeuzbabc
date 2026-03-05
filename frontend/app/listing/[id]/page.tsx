import ListingClient from "./client";

export default async function ListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ListingClient id={id} />;
}
