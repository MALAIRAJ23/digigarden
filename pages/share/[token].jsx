// pages/share/[token].jsx
import { useRouter } from "next/router";
import { resolveShareToken } from "../../lib/storage";
import { useEffect } from "react";

export default function SharePage() {
  const router = useRouter();
  const { token } = router.query;
  useEffect(() => {
    if (!token) return;
    const slug = resolveShareToken(token);
    if (!slug) {
      alert("Link invalid or expired.");
      router.push("/");
      return;
    }
    window.location.href = `/public/${slug}`;
  }, [token]);
  return <div>Redirecting...</div>;
}
