import HoldingTable from '../../components/holding-table.js';
import Pagination from '../../components/pagination.js';
import { getHoldingsByView, hydrateMetadata } from '../../lib/holdings.js';
import views from '../../lib/views.js';
import useActiveView from '../../hooks/use-active-view.js';

const pageSize = 24;

export default function View({ holdings, page, totalPages }) {
  const view = useActiveView();
  const getUrlForPage = (page) =>
    `/view/${view}` + (page === 1 ? '' : `/${page}`);

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

export async function getStaticProps({ params: { slug } }) {
  const [name, page] = slug;

  const startIndex = ((+page || 1) - 1) * pageSize;
  const allHoldings = await getHoldingsByView(name);
  const holdings = allHoldings.slice(startIndex, startIndex + pageSize);

  await hydrateMetadata(holdings);

  return {
    props: {
      holdings,
      page: +page || 1,
      totalPages: Math.ceil(allHoldings.length / pageSize),
    },
  };
}

export async function getStaticPaths() {
  const paths = [];

  for (const name of Object.keys(views)) {
    const holdings = await getHoldingsByView(name);

    paths.push({ params: { slug: [name] } });

    for (let i = 0; i * pageSize < holdings.length; i++) {
      paths.push({
        params: { slug: [name, (i + 1).toString()] },
      });
    }
  }

  return {
    paths,
    fallback: false,
  };
}
