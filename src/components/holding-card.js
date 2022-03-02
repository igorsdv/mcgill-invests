import { faChartLine, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cn from 'classnames';
import views from '../lib/views.js';

const $ = (value) =>
  value.toLocaleString('en-CA', {
    style: 'currency',
    currency: 'CAD',
  });

function YahooFinanceLink({ ticker, children }) {
  return (
    <a
      href={`https://finance.yahoo.com/quote/${ticker}`}
      className="hover:text-slate-400"
      target="_blank"
      rel="noreferrer"
    >
      {children}
    </a>
  );
}

export default function HoldingCard({ holding }) {
  const {
    description1,
    ticker,
    country,
    marketValue,
    matchingViews,
    businessProfile,
  } = holding;

  return (
    <div className="border-t w-full lg:w-1/2 lg:max-w-[40rem] p-3 border-t-gray-300 border-l-4 border-l-gray-200">
      <h3 className="line-clamp-1 text-gray-800 font-bold">
        {businessProfile.name.toUpperCase() || description1}
      </h3>
      <div className="text-gray-600 font-serif">
        {businessProfile.description && (
          <>
            <FontAwesomeIcon
              icon={faChartLine}
              fixedWidth
              className="mr-1 align-middle"
            />
            <YahooFinanceLink ticker={ticker}>{ticker}</YahooFinanceLink>
            {' · '}
          </>
        )}
        <span className="font-bold">{$(marketValue)}</span>
        <span> · {country}</span>
        {matchingViews.length > 0 && ' · '}
        {matchingViews.map((view, i) => (
          <FontAwesomeIcon
            key={i}
            icon={views[view].icon}
            title={views[view].text}
            className={cn({ 'text-red-900': views[view].harmful })}
            fixedWidth
          />
        ))}
        {businessProfile.description && (
          <p className="line-clamp-3 leading-snug">
            <FontAwesomeIcon
              icon={faInfoCircle}
              fixedWidth
              className="mr-1 align-middle"
            />
            {businessProfile.description}
          </p>
        )}
      </div>
    </div>
  );
}
