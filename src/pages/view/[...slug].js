import { getGroupedHoldingsByView } from '../../lib/api.js';
import views from '../../lib/views.js';

const pageSize = 20;

export default function View({ holdings, page, totalPages }) {
  const $ = (value) =>
    value.toLocaleString('en-CA', {
      style: 'currency',
      currency: 'CAD',
    });

  return (
    <>
      {holdings.map((h) => {
        return (
          <div
            key={h.id}
            className="border-t w-full lg:w-1/2 lg:max-w-[40rem] p-3 border-t-gray-300 border-l-4 border-l-gray-200"
          >
            <h3 className="text-gray-800 font-bold">{h.description1}</h3>
            <div className="text-gray-600 font-serif">
              <span>{h.country} · </span>
              <span className="font-bold">{$(h.marketValue)}</span>
            </div>
          </div>
        );
      })}
      {`${page} of ${totalPages}`}
    </>
  );
}

export async function getStaticProps({ params: { slug } }) {
  const [name, page] = slug;

  const startIndex = ((page || 1) - 1) * pageSize;
  const allHoldings = await getGroupedHoldingsByView(name);
  const holdings = allHoldings.slice(startIndex, startIndex + pageSize);

  return {
    props: {
      holdings,
      page: page || 1,
      totalPages: Math.ceil(allHoldings.length / pageSize),
    },
  };
}

export async function getStaticPaths() {
  const paths = [];

  for (const name of Object.keys(views)) {
    const holdings = await getGroupedHoldingsByView(name);

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
