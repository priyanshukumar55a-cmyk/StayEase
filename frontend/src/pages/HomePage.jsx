import { useEffect, useState } from "react";
import HomeList from "./HomeList";
import { getHomes } from "@/api/homeApi";
import { Loader2 } from "lucide-react";
import HomeCardSkeleton from "@/components/skeletons/HomeCardSkeleton";
import Pagination from "@/components/Pagination";

export default function HomePage() {
  const [homes, setHomes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomes = async () => {
      setLoading(true);
      try {
        const res = await getHomes(currentPage);

        setHomes(res.homes);
        setTotalPages(res.totalPages);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomes();
  }, [currentPage]);

  if (loading) {
    return <HomeCardSkeleton />;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <HomeList homes={homes} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
