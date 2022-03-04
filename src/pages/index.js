import { Chart } from 'react-google-charts';
import { Spinner } from '../components/icons.js';
import { getDefinedViews } from '../lib/config.js';
import { getHoldingsByView } from '../lib/holdings.js';
import views from '../lib/views.js';

export default function Index({ summary }) {
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
      <p className="mb-4">Here is an overview of the endowment:</p>
      <Chart
        chartType="ColumnChart"
        data={summary}
        width="100%"
        height="400px"
        options={{
          title: 'Investment total by category and asset origin',
          legend: 'bottom',
          isStacked: true,
        }}
        loader={<Spinner />}
      />
    </div>
  );
}

export async function getStaticProps() {
  const holdings = await getHoldingsByView('all');
  const summaryByView = Object.fromEntries(
    getDefinedViews().map((view) => [
      view,
      { origin: { can: 0, us: 0, intl: 0 } },
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
    }
  }

  const summary = [
    ['Country', 'Canadian', 'US', 'International'],
    ...Object.entries(summaryByView).map(([view, { origin }]) => [
      views[view].text,
      origin.us,
      origin.can,
      origin.intl,
    ]),
  ];

  return { props: { summary } };
}
