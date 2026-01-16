import { useRouter } from 'next/router';
import Link from 'next/link';

export default function MobileNav() {
  const router = useRouter();

  const navItems = [
    { href: '/', icon: '🏠', label: 'Home' },
    { href: '/dashboard', icon: '📊', label: 'Dashboard' },
    { href: '/collections', icon: '📚', label: 'Collections' },
    { href: '/analytics', icon: '📈', label: 'Analytics' },
    { href: '/settings', icon: '⚙️', label: 'Settings' }
  ];

  return (
    <nav className="mobile-nav">
      {navItems.map((item) => (
        <Link 
          key={item.href} 
          href={item.href}
          className={router.pathname === item.href ? 'active' : ''}
        >
          <span className="mobile-nav-icon">{item.icon}</span>
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}