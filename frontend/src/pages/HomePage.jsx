import { useEffect, useState } from "react";
import HomeList from "./HomeList";
import { getHomes } from "@/api/homeApi";
import { Loader2 } from "lucide-react";

export default function HomePage() {
  const [homes, setHomes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomes = async () => {
      try {
        const res = await getHomes();

        setHomes(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomes();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-black/80" />
        <span className="text-3xl text-black/80">Loading...</span>
      </div>
    );
  }

  return <HomeList homes={homes} />;
}
