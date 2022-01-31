import cn from 'classnames';
import { useState } from 'react';
import Sidebar from './sidebar.js';

export default function Layout({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-wrap min-w-[20rem]">
      <Sidebar open={open} setOpen={setOpen} />
      <main
        className={cn(
          'flex flex-wrap w-full p-4 mt-[3.75rem] md:mt-0 md:ml-80',
          { 'h-screen md:h-auto overflow-y-clip md:overflow-y-auto mt-0': open }
        )}
      >
        {children}
      </main>
    </div>
  );
}
