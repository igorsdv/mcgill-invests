import cn from 'classnames';
import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';

function LinkOrSpan({ href, className, ...props }) {
  return href ? (
    <Link href={href}>
      <a className={className} {...props} />
    </Link>
  ) : (
    <span className={cn('cursor-default', className)} {...props} />
  );
}

function PageLink({ page, href }) {
  return (
    <LinkOrSpan
      href={href}
      className={cn(
        'inline-flex items-center px-3 py-2 border text-sm font-medium',
        {
          'bg-white border-gray-300 text-gray-500 hover:bg-slate-50': href,
          'z-0 bg-slate-200 border-slate-400 text-slate-700': !href,
        }
      )}
    >
      {page}
    </LinkOrSpan>
  );
}

function Ellipsis() {
  return (
    <span className="inline-flex items-center px-2 sm:px-3 py-2 cursor-default border border-gray-300 bg-white text-sm font-medium text-gray-700">
      ...
    </span>
  );
}

export default function Pagination({ page, totalPages, getUrlForPage }) {
  const [start, end] = [
    totalPages < 6 || page < 5 ? 1 : Math.min(page + 1, totalPages) - 2,
    totalPages < 6 || totalPages < page + 4
      ? totalPages
      : Math.max(1, page - 1) + 2,
  ];

  const components = [];

  if (start !== 1) {
    components.push(<PageLink key={1} page={1} href={getUrlForPage(1)} />);
    components.push(<Ellipsis key="el1" />);
  }

  for (let i = start; i <= end; i++) {
    components.push(
      <PageLink key={i} page={i} href={i !== page && getUrlForPage(i)} />
    );
  }

  if (end !== totalPages) {
    components.push(<Ellipsis key="el2" />);
    components.push(
      <PageLink
        key={totalPages}
        page={totalPages}
        href={getUrlForPage(totalPages)}
      />
    );
  }

  return (
    <div className="py-3">
      <div className="flex-1 flex items-center justify-center">
        <nav className="inline-flex flex-wrap rounded-md shadow-sm -space-x-px">
          <LinkOrSpan
            href={page > 1 && getUrlForPage(page - 1)}
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
            href={page < totalPages && getUrlForPage(page + 1)}
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
