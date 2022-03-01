import { useRouter } from 'next/router';

export default function useActiveView() {
  const { pathname, query } = useRouter();

  return pathname === '/view/[...slug]' && query.slug[0];
}
