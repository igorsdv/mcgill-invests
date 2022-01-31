import { useRouter } from 'next/router';

export default function useActiveView() {
  const { pathname, query } = useRouter();

  return pathname === '/view/[name]' && query.name;
}
