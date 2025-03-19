import { useRouter } from "next/router";
import SlideRenderer from "../../components/SlideRenderer";

export default function SlidesPage() {
  const router = useRouter();
  const { slug } = router.query;

  if (!slug) {
    return <div>Loading...</div>;
  }

  // Use the slug to determine which markdown file to load
  const markdownPath = `/slides/${slug}.md`;

  return (
    <div className="slide-page">
      <SlideRenderer markdownPath={markdownPath} />
    </div>
  );
}
