import AppBar from "@/components/AppBar";
import Rail from "@/components/Rail";

export default function ShellLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app">
      <AppBar />
      <div className="app-row">
        <Rail />
        <main className="main">{children}</main>
      </div>
    </div>
  );
}
