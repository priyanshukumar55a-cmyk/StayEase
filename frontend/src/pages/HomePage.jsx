import { useEffect, useState } from "react";
import HomeList from "./HomeList";
import { getHomes } from "@/api/homeApi";

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
      <div className="flex justify-center items-center h-[60vh]">
        Loading...
      </div>
    );
  }

  return <HomeList homes={homes} />;
}
