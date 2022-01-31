import { getHoldings } from '../../lib/api.js';
import views from '../../lib/views.js';

export default function View({ holdings }) {
  return (
    <>
      {holdings.map(({ id, description1, marketValue }) => (
        <div
          key={id}
          className="border-t w-full lg:w-1/2 lg:max-w-[40rem] p-3 border-t-gray-300 border-l-4 border-l-gray-200"
        >
          <h3 className="text-gray-800 font-bold">{description1}</h3>
          <div className="text-gray-600 font-serif">
            <span>France · </span>
            <span className="font-bold">{marketValue}</span>
          </div>
        </div>
      ))}
    </>
  );
}

export async function getStaticProps() {
  const allHoldings = await getHoldings();
  const holdings = allHoldings
    .slice(0, 20)
    .map(({ id, description1, marketValue }) => ({
      id,
      description1,
      marketValue,
    }));

  return {
    props: { holdings },
  };
}

export function getStaticPaths() {
  return {
    paths: Object.keys(views).map((name) => ({ params: { name } })),
    fallback: false,
  };
}
