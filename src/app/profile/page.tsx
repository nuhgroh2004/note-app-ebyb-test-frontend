import Link from "next/link";

export default function ProfilePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "#eef2f6",
        color: "#1f2733",
        fontFamily: "var(--font-jakarta), sans-serif",
      }}
    >
      <section
        style={{
          width: "min(520px, 92vw)",
          borderRadius: "14px",
          border: "1px solid rgba(31, 39, 51, 0.15)",
          background: "#fff",
          padding: "24px",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "1.25rem" }}>Profile</h1>
        <p style={{ margin: "10px 0 0", lineHeight: 1.55 }}>
          Halaman profile sementara sudah aktif. Kamu bisa lanjutkan pengembangan detail
          profile di tahap berikutnya.
        </p>
        <Link
          href="/dashboard"
          style={{
            marginTop: "16px",
            display: "inline-flex",
            alignItems: "center",
            minHeight: "36px",
            padding: "0 12px",
            borderRadius: "8px",
            background: "#1f2733",
            color: "#fff",
            textDecoration: "none",
            fontSize: "0.9rem",
            fontWeight: 600,
          }}
        >
          Kembali ke Dashboard
        </Link>
      </section>
    </main>
  );
}
