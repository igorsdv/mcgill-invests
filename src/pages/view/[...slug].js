import HoldingCard from '../../components/holding-card.js';
import Pagination from '../../components/pagination.js';
import { getHoldingsByView, hydrateMetadata } from '../../lib/api.js';
import views from '../../lib/views.js';

const pageSize = 20;

export default function View({ holdings, page, totalPages }) {
  return (
    <>
      <div className="flex flex-wrap">
        {holdings.map((holding, i) => (
          <HoldingCard key={i} holding={holding} />
        ))}
      </div>
      <Pagination page={page} totalPages={totalPages} />
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
