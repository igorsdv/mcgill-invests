import Link from 'next/link';
import { Chart } from 'react-google-charts';
import { Spinner } from '../components/icons.js';
import { getDefinedViews } from '../lib/config.js';
import { getRawHoldings, getAllHoldings } from '../lib/holdings.js';
import { formatCurrency, sumMarketValue } from '../lib/util.js';
import views from '../lib/views.js';

export default function Index({
  originSummary,
  categorySummary,
  total,
  companiesTotal,
}) {
  return (
    <div className="max-w-5xl font-serif text-lg">
      <p className="mb-4">
        <span className="font-bold font-sans">mcgillinvests.in</span> is a tool
        to explore McGill University’s investment data, obtained by Divest
        McGill via Access to Information requests.
      </p>
      <p className="mb-4">
        We have organized the endowment into several categories of interest,
        bringing into focus the investments that we do not consider socially and
        environmentally responsible. Contextual information about each company
        and links to further research are provided where available.
      </p>
      <p>Here is an overview of the endowment:</p>
      <Chart
        chartType="ColumnChart"
        data={originSummary}
        width="100%"
        height="400px"
        options={{
          title: 'Investment total by category and asset origin',
          legend: 'bottom',
          isStacked: true,
        }}
        loader={<Spinner className="mt-4" />}
      />
      <p className="mt-4 mb-4">
        The approximate total value of McGill’ endowment is{' '}
        <span className="font-bold">{formatCurrency(total)}</span>.
      </p>
      <p className="mb-4">
        Direct equity and fixed-income investments in corporate entities
        (excluding cash-equivalent assets, foreign currency, government bonds,
        mutual funds, mortgage-backed loans, and real estate) amount to{' '}
        <span className="font-bold">{formatCurrency(companiesTotal)}</span>,
        distributed as follows:
      </p>
      <Chart
        chartType="PieChart"
        data={categorySummary}
        width="100%"
        height="300px"
        options={{
          title: 'Investment total by category (corporate)',
          sliceVisibilityThreshold: 0,
        }}
        loader={<Spinner className="mt-4" />}
      />
      <p className="mb-4">
        Browse the categories in the sidebar, or take a look at one of the
        following companies:
      </p>
      <div className="font-sans mb-4">
        {['bhp', 'shell', 'canadian natural resources'].map((term) => (
          <Link key={term} href={`/search?q=${term}`}>
            <a className="px-2 py-1 mr-2 border border-slate-500 bg-gradient-to-b from-slate-100 to-slate-300 hover:bg-none hover:bg-sky-100 rounded">
              {term}
            </a>
          </Link>
        ))}
      </div>
      <p className="mb-2">Investment data current as of November 30, 2021.</p>
      <p className="text-xs">
        The information presented on this website is the result of both manual
        and automated data processing that includes data from third-party
        sources. Despite best efforts, the authors do not guarantee the
        correctness, reliability, and completeness of the information provided.
      </p>
    </div>
  );
}

export async function getStaticProps() {
  const holdings = await getAllHoldings();
  const summaryByView = Object.fromEntries(
    getDefinedViews().map((view) => [
      view,
      { origin: { can: 0, us: 0, intl: 0 }, marketValue: 0 },
    ])
  );

  for (const { country, marketValue, matchingViews } of holdings) {
    for (const view of matchingViews) {
      if (country === 'Canada') {
        summaryByView[view].origin.can += marketValue;
      } else if (country === 'United States') {
        summaryByView[view].origin.us += marketValue;
      } else {
        summaryByView[view].origin.intl += marketValue;
      }

      summaryByView[view].marketValue += marketValue;
    }
  }

  const total = sumMarketValue(await getRawHoldings());
  const companiesTotal = sumMarketValue(holdings);

  const originSummary = [
    ['Origin', 'Canadian', 'US', 'International'],
    ...Object.entries(summaryByView).map(([view, { origin }]) => [
      views[view].text,
      origin.us,
      origin.can,
      origin.intl,
    ]),
  ];

  const categorySummary = [
    ['Category', 'Value'],
    ...Object.entries(summaryByView).map(([view, { marketValue }]) => [
      views[view].text,
      marketValue,
    ]),
    [
      'Other Companies',
      companiesTotal - sumMarketValue(Object.values(summaryByView)),
    ],
  ];

  return { props: { originSummary, categorySummary, total, companiesTotal } };
}
