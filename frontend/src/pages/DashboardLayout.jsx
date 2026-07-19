import { useCallback, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { api } from "../api/client";

export default function DashboardLayout() {
  const [pdfs, setPdfs] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const [pdfList, convoList] = await Promise.all([api.listPdfs(), api.listConversations()]);
    setPdfs(pdfList);
    setConversations(convoList);
  }, []);

  useEffect(() => {
    refresh().finally(() => setLoading(false));
  }, [refresh]);

  return (
    <div className="flex h-screen bg-[radial-gradient(circle_at_top_left,_rgba(232,163,61,0.12),_transparent_30%),linear-gradient(135deg,_#040711_0%,_#0d1326_100%)]">
      <Sidebar pdfs={pdfs} conversations={conversations} loading={loading} onChange={refresh} />
      <main className="flex min-w-0 flex-1 flex-col">
        <Outlet context={{ pdfs, conversations, refresh }} />
      </main>
    </div>
  );
}
