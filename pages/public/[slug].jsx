// pages/public/[slug].jsx
import { useRouter } from "next/router";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getAllNotes } from "../../lib/storage";

export default function PublicNote() {
  const router = useRouter();
  const { slug } = router.query;
  if (!slug) return <div>Loading...</div>;
  const note = getAllNotes().find((n) => n.slug === slug && n.visibility === "public");
  if (!note) return <div>Public note not found.</div>;
  return (
    <div>
      <h1>{note.title}</h1>
      <div className="card" style={{ marginTop: 12 }}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{note.content}</ReactMarkdown>
      </div>
    </div>
  );
}
