import cn from 'classnames';
import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import useActiveView from '../hooks/use-active-view.js';

function LinkOrSpan({ page, className, ...props }) {
  const view = useActiveView();

  return page ? (
    <Link href={`/view/${view}` + (page === 1 ? '' : `/${page}`)}>
      <a className={className} {...props} />
    </Link>
  ) : (
    <span className={cn('cursor-default', className)} {...props} />
  );
}

function PageLink({ page, active }) {
  return (
    <LinkOrSpan
      page={!active && page}
      className={cn(
        'inline-flex items-center px-3 py-2 border text-sm font-medium',
        {
          'z-10 bg-slate-200 border-slate-400 text-slate-700': active,
          'bg-white border-gray-300 text-gray-500 hover:bg-slate-50': !active,
        }
      )}
    >
      {page}
    </LinkOrSpan>
  );
}

export default function Pagination({ page, totalPages }) {
  const [start, end] = [
    page < 5 ? 1 : Math.min(page + 1, totalPages) - 2,
    totalPages < page + 4 ? totalPages : Math.max(1, page - 1) + 2,
  ];

  const components = [];
  const ellipsis = (
    <span className="inline-flex items-center px-2 sm:px-3 py-2 cursor-default border border-gray-300 bg-white text-sm font-medium text-gray-700">
      ...
    </span>
  );

  if (start !== 1) {
    components.push(<PageLink page={1} active={false} />);
    components.push(ellipsis);
  }

  for (let i = start; i <= end; i++) {
    components.push(<PageLink page={i} active={i === page} />);
  }

  if (end !== totalPages) {
    components.push(ellipsis);
    components.push(<PageLink page={totalPages} active={false} />);
  }

  return (
    <div className="py-3">
      <div className="flex-1 flex items-center justify-center">
        <nav className="z-0 inline-flex flex-wrap rounded-md shadow-sm -space-x-px">
          <LinkOrSpan
            page={page > 1 && page - 1}
            className={cn(
              'inline-flex items-center px-2 sm:px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium',
              {
                'hover:bg-gray-50 text-gray-500': page > 1,
                'text-gray-300': page === 1,
              }
            )}
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </LinkOrSpan>
          {components}
          <LinkOrSpan
            page={page < totalPages && page + 1}
            className={cn(
              'inline-flex items-center px-2 sm:px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500',
              {
                'hover:bg-gray-50 text-gray-500': page < totalPages,
                'text-gray-300': page === totalPages,
              }
            )}
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </LinkOrSpan>
        </nav>
      </div>
    </div>
  );
}
