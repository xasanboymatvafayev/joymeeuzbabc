import ListingClient from "./client";

export async function generateStaticParams() {
  return [];
}

export default function ListingPage({ params }: { params: { id: string } }) {
  return <ListingClient id={params.id} />;
}
