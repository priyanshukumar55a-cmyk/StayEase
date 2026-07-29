import { useEffect, useState } from "react";
import HomeList from "./HomeList";
import { getHomes } from "@/api/homeApi";
import { Loader2 } from "lucide-react";
import HomeCardSkeleton from "@/components/skeletons/HomeCardSkeleton";

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
      <div className="p-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <HomeCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return <HomeList homes={homes} />;
}
