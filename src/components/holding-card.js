import cn from 'classnames';
import {
  faChartLine,
  faExclamationTriangle,
  faExternalLinkAlt,
  faFolderOpen,
  faGlobe,
  faIndustry,
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import views from '../lib/views.js';

function $(value) {
  return value.toLocaleString('en-CA', {
    style: 'currency',
    currency: 'CAD',
  });
}

function precisionRound(number, precision) {
  const factor = Math.pow(10, precision);

  return Math.round(number * factor) / factor;
}

function extractHost(url) {
  return new URL(url).hostname.split('.').slice(-2).join('.');
}

function ExternalLink({ href, children }) {
  return (
    <a
      href={href}
      className="text-sky-600 hover:text-sky-400 font-sans text-sm"
      target="_blank"
      rel="noreferrer"
    >
      {children}{' '}
      <FontAwesomeIcon
        icon={faExternalLinkAlt}
        className="inline-block align-baseline text-xs"
        fixedWidth
      />
    </a>
  );
}

function Reserves({ metadata }) {
  const { oilGas, coal } = metadata;

  if (!oilGas && !coal) {
    return null;
  }

  const description = [oilGas && 'oil & gas', coal && 'coal']
    .filter((e) => e)
    .join(', ');

  const total = precisionRound(+oilGas + +coal, 3);

  return (
    <div className="mt-1 leading-snug font-serif">
      <FontAwesomeIcon icon={faIndustry} className="text-red-900" fixedWidth />{' '}
      <span className="font-bold">{total}</span> tons of CO<sub>2</sub> reserves
      ({description})
    </div>
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
    metadata,
  } = holding;

  return (
    <div
      className={cn(
        'border-t w-full lg:w-1/2 lg:max-w-[40rem] p-3 text-slate-800 border-t-slate-200 border-l-4',
        {
          'border-l-slate-200': !metadata.note,
          'border-l-red-900': metadata.note,
        }
      )}
    >
      <h3 className="line-clamp-1 font-bold">
        {businessProfile.name.toUpperCase() || description1}
      </h3>
      <div className="text-slate-600 font-serif">
        {businessProfile.description && (
          <>
            <FontAwesomeIcon icon={faChartLine} fixedWidth className="mr-1" />
            <ExternalLink href={`https://finance.yahoo.com/quote/${ticker}`}>
              {ticker}
            </ExternalLink>
            {' · '}
          </>
        )}
        <span className="font-bold text-slate-700">{$(marketValue)}</span>
        {' · '}
        <span className="text-gray-500">{country}</span>
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
      </div>
      {businessProfile.description && (
        <div className="mt-1 line-clamp-3 leading-snug text-slate-600 font-serif">
          <FontAwesomeIcon
            icon={faInfoCircle}
            fixedWidth
            className="mr-1 align-middle"
          />
          {businessProfile.description}
        </div>
      )}
      {metadata.note && (
        <div className="mt-1 leading-snug font-serif">
          <FontAwesomeIcon
            icon={faExclamationTriangle}
            className="text-red-900"
            fixedWidth
          />
          {' ' + metadata.note}
        </div>
      )}
      <Reserves metadata={metadata} />
      {metadata.news1 && (
        <div className="mt-1 leading-snug text-slate-600 font-serif">
          <FontAwesomeIcon icon={faGlobe} fixedWidth />
          {' In the news · '}
          <ExternalLink href={metadata.news1}>
            {extractHost(metadata.news1)}
          </ExternalLink>
          {metadata.news2 && (
            <>
              {' · '}
              <ExternalLink href={metadata.news2}>
                {extractHost(metadata.news2)}
              </ExternalLink>
            </>
          )}
        </div>
      )}
      {metadata.link && (
        <div className="mt-1 leading-snug text-slate-600 font-serif">
          <FontAwesomeIcon
            icon={faFolderOpen}
            className="text-green-700"
            fixedWidth
          />
          {' Divest McGill dossier · '}
          <ExternalLink href={metadata.link}>Google Drive</ExternalLink>
        </div>
      )}
    </div>
  );
}
