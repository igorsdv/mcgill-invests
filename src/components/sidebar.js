import cn from 'classnames';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import useActiveView from '../hooks/use-active-view.js';
import views from '../lib/views.js';

export default function Sidebar({ open, setOpen }) {
  const activeView = useActiveView();

  return (
    <aside
      className={cn(
        'fixed w-full md:w-80 md:h-screen overflow-y-auto text-slate-100 bg-slate-700',
        { 'h-screen': open }
      )}
    >
      <header className="p-4">
        <button
          className="float-right md:hidden pt-[2px]"
          onClick={() => setOpen(!open)}
        >
          <FontAwesomeIcon icon={faBars} fixedWidth />
        </button>
        <h1 className="text-lg font-bold">
          <Link href="/">
            <a>mcgillinvests.in</a>
          </Link>
        </h1>
      </header>
      <nav className={cn('md:block', { hidden: !open })}>
        <ul>
          {Object.entries(views).map(([name, { text, icon }]) => (
            <li
              key={name}
              className={cn('text-lg px-4 py-1', {
                'text-slate-700 bg-slate-100': activeView === name,
              })}
            >
              <Link href={`/view/${name}`}>
                <a className="block lowercase" onClick={() => setOpen(false)}>
                  <span className="float-right">
                    <FontAwesomeIcon icon={icon} fixedWidth />
                  </span>
                  {text}
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
