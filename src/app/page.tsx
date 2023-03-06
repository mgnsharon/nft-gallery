import Gallery from "@/components/gallery";

export default function Home() {
  return (
    <main className="container mx-auto">
      <Gallery pageSize={10} />
    </main>
  );
}
