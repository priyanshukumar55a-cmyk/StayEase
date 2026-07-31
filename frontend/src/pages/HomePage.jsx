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
    return <HomeCardSkeleton />;
  }

  return <HomeList homes={homes} />;
}
