import CallTopBar from "@/components/CallTopBar";

export default function CallLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app">
      <CallTopBar />
      <div className="app-row">
        <main className="main">{children}</main>
      </div>
    </div>
  );
}
