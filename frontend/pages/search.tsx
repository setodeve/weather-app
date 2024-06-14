import React, {useEffect, useState} from'react';
import { useRouter } from 'next/router'
import City from '@/components/City';

const Search: React.FC = () => {
  const router = useRouter()
  const [cities, setCities] = useState<string[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const pref = router.query.pref as string;
      const res = await fetch('/pref.json');
      const result = await res.json();
      setCities(result[pref]);
    };
    fetchData();
  }, [router ,router.query.pref]);

  if (!cities || cities?.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <City pref={router.query.pref as string} cities={cities as string[]} />
  );
};
export default Search;