import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import HoldingTable from '../components/holding-table.js';
import { Spinner } from '../components/icons.js';
import Pagination from '../components/pagination.js';

export default function Search() {
  const [data, setData] = useState(null);
  const { query, isReady } = useRouter();
  const params = new URLSearchParams(query);
  const q = params.get('q') ?? '';
  const page = parseInt(params.get('page'), 10) || 1;

  useEffect(() => {
    if (!isReady) {
      return;
    }

    fetch('/api/holdings?' + new URLSearchParams({ q, page }).toString())
      .then((res) => res.json())
      .then((data) => setData(data));
  }, [q, page, isReady]);

  if (data === null) {
    return (
      <p>
        <Spinner />
      </p>
    );
  }

  const { holdings, totalPages } = data;

  if (holdings.length === 0) {
    return <p>No results.</p>;
  }

  const getUrlForPage = (page) =>
    '/search?' + new URLSearchParams({ q, page }).toString();

  return (
    <>
      <HoldingTable holdings={holdings} />
      <Pagination
        page={page}
        totalPages={totalPages}
        getUrlForPage={getUrlForPage}
      />
    </>
  );
}
