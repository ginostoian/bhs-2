"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  Archive,
  BellRing,
  Building2,
  ChevronDown,
  CircleHelp,
  ClipboardPenLine,
  CreditCard,
  FileClock,
  FilePlus2,
  FileText,
  Home,
  Image,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  Paintbrush,
  PanelLeftClose,
  PanelLeftOpen,
  ReceiptText,
  Settings,
  TicketCheck,
  UserRound,
  X,
} from "lucide-react";
import { signOut } from "next-auth/react";

const ICONS = {
  account: UserRound,
  archive: Archive,
  changes: ClipboardPenLine,
  dashboard: LayoutDashboard,
  email: Mail,
  invoices: ReceiptText,
  moodboards: Paintbrush,
  payments: CreditCard,
  photos: Image,
  project: Building2,
  quote: FilePlus2,
  quotes: FileClock,
  settings: Settings,
  support: CircleHelp,
  tickets: TicketCheck,
};

function isItemActive(pathname, href, exact = false) {
  if (exact || href === "/dashboard") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

function Brand({ compact = false, onNavigate }) {
  return (
    <Link
      href="/dashboard"
      onClick={onNavigate}
      className="group flex min-w-0 items-center gap-3 text-white hover:text-white"
      aria-label="Better Homes client portal overview"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border border-white/35 text-white transition-colors group-hover:border-white/60">
        <Home aria-hidden="true" className="h-5 w-5" strokeWidth={1.45} />
      </span>
      {compact ? null : (
        <span className="min-w-0">
          <span className="block truncate text-[15px] font-semibold tracking-[-0.01em] text-white">
            Better Homes
          </span>
          <span className="text-white/48 mt-0.5 block text-[10px] font-medium uppercase tracking-[0.18em]">
            Client portal
          </span>
        </span>
      )}
    </Link>
  );
}

function NavItem({ item, collapsed, onNavigate }) {
  const pathname = usePathname();
  const active = isItemActive(pathname, item.href, item.exact);
  const Icon = ICONS[item.icon] || FileText;

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      title={collapsed ? item.name : undefined}
      aria-current={active ? "page" : undefined}
      className={`group relative flex min-h-11 items-center rounded-md text-[13px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4f7cff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#10251e] ${
        collapsed ? "justify-center px-2" : "gap-3 px-3"
      } ${
        item.emphasis
          ? "mt-2 bg-[#1559d6] text-white hover:bg-[#104dbd]"
          : active
            ? "bg-white/[0.11] text-white"
            : "text-white/70 hover:bg-white/[0.065] hover:text-white"
      }`}
    >
      {active && !item.emphasis ? (
        <span className="absolute inset-y-2.5 left-0 w-0.5 rounded-r-full bg-[#7ea1ff]" />
      ) : null}
      <Icon
        aria-hidden="true"
        className={`h-[18px] w-[18px] shrink-0 ${
          item.emphasis || active
            ? "text-white"
            : "text-white/55 group-hover:text-white/85"
        }`}
        strokeWidth={1.65}
      />
      {collapsed ? null : <span className="truncate">{item.name}</span>}
    </Link>
  );
}

function NavGroup({ group, collapsed, onNavigate }) {
  const pathname = usePathname();
  const containsActiveItem = group.items.some((item) =>
    isItemActive(pathname, item.href, item.exact),
  );
  const [open, setOpen] = useState(group.defaultOpen || containsActiveItem);

  useEffect(() => {
    if (containsActiveItem) setOpen(true);
  }, [containsActiveItem]);

  if (!group.name) {
    return (
      <div className="space-y-1">
        {group.items.map((item) => (
          <NavItem
            key={item.href}
            item={item}
            collapsed={collapsed}
            onNavigate={onNavigate}
          />
        ))}
      </div>
    );
  }

  if (collapsed) {
    return (
      <div className="space-y-1 border-t border-white/[0.08] pt-3">
        {group.items.map((item) => (
          <NavItem
            key={item.href}
            item={item}
            collapsed
            onNavigate={onNavigate}
          />
        ))}
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="mb-1 flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-[0.16em] text-white/35 transition-colors hover:text-white/65 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4f7cff]"
        aria-expanded={open}
      >
        {group.name}
        <ChevronDown
          aria-hidden="true"
          className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open ? (
        <div className="space-y-1">
          {group.items.map((item) => (
            <NavItem
              key={item.href}
              item={item}
              collapsed={false}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function Sidebar({
  navGroups,
  collapsed,
  mobile = false,
  onNavigate,
  onToggleCollapsed,
  user,
}) {
  const initials = (user?.name || user?.email || "U")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <aside
      className={`flex h-full flex-col border-r border-black/10 bg-[#10251e] text-white ${
        mobile ? "w-[296px]" : collapsed ? "w-[76px]" : "w-[264px]"
      } transition-[width] duration-200`}
    >
      <div
        className={`flex h-[76px] shrink-0 items-center border-b border-white/[0.08] ${
          collapsed && !mobile ? "justify-center px-3" : "px-5"
        }`}
      >
        <Brand compact={collapsed && !mobile} onNavigate={onNavigate} />
      </div>

      <nav
        className={`flex-1 space-y-4 overflow-y-auto py-5 ${
          collapsed && !mobile ? "px-2.5" : "px-3"
        }`}
        aria-label="Client portal navigation"
      >
        {navGroups.map((group, index) => (
          <NavGroup
            key={group.name || `primary-${index}`}
            group={group}
            collapsed={collapsed && !mobile}
            onNavigate={onNavigate}
          />
        ))}
      </nav>

      <div className="shrink-0 border-t border-white/[0.08] p-3">
        <div
          className={`flex items-center py-2 ${
            collapsed && !mobile ? "justify-center" : "gap-3 px-2"
          }`}
          title={collapsed && !mobile ? user?.name || user?.email : undefined}
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e8e3d8] text-[11px] font-semibold text-[#173129]">
            {initials}
          </div>
          {collapsed && !mobile ? null : (
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-white">
                {user?.name || "My account"}
              </p>
              <p className="text-white/42 mt-0.5 truncate text-[10px]">
                {user?.email}
              </p>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/auth/signin" })}
          className={`mt-1 flex min-h-10 w-full items-center rounded-md text-xs text-white/55 transition-colors hover:bg-white/[0.065] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4f7cff] ${
            collapsed && !mobile ? "justify-center" : "gap-3 px-3"
          }`}
          aria-label="Sign out"
          title={collapsed && !mobile ? "Sign out" : undefined}
        >
          <LogOut aria-hidden="true" className="h-4 w-4" strokeWidth={1.7} />
          {collapsed && !mobile ? null : <span>Sign out</span>}
        </button>

        {mobile ? null : (
          <button
            type="button"
            onClick={onToggleCollapsed}
            className={`mt-1 flex min-h-10 w-full items-center rounded-md text-xs text-white/45 transition-colors hover:bg-white/[0.065] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4f7cff] ${
              collapsed ? "justify-center" : "gap-3 px-3"
            }`}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <PanelLeftOpen aria-hidden="true" className="h-4 w-4" />
            ) : (
              <PanelLeftClose aria-hidden="true" className="h-4 w-4" />
            )}
            {collapsed ? null : <span>Collapse sidebar</span>}
          </button>
        )}
      </div>
    </aside>
  );
}

export default function ClientPortalShell({
  children,
  navGroups,
  user,
  projectSelector,
  notificationBell,
  profileImage,
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const activeItem = useMemo(() => {
    for (const group of navGroups) {
      const match = group.items
        .filter((item) => isItemActive(pathname, item.href, item.exact))
        .sort((a, b) => b.href.length - a.href.length)[0];
      if (match) return match;
    }
    return null;
  }, [navGroups, pathname]);

  return (
    <div className="client-portal min-h-screen bg-[#f8f7f3] font-[Satoshi] text-[#17231f]">
      <div className="fixed inset-y-0 left-0 z-30 hidden lg:block">
        <Sidebar
          navGroups={navGroups}
          collapsed={collapsed}
          onToggleCollapsed={() => setCollapsed((value) => !value)}
          user={user}
        />
      </div>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-[#07120e]/65 backdrop-blur-[2px]"
            aria-label="Close navigation"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative h-full w-[296px] shadow-2xl">
            <Sidebar
              navGroups={navGroups}
              collapsed={false}
              mobile
              onNavigate={() => setMobileOpen(false)}
              user={user}
            />
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="absolute right-3 top-5 flex h-10 w-10 items-center justify-center rounded-md text-white/70 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7ea1ff]"
              aria-label="Close navigation"
            >
              <X aria-hidden="true" className="h-5 w-5" />
            </button>
          </div>
        </div>
      ) : null}

      <div
        className={`min-h-screen transition-[padding] duration-200 ${
          collapsed ? "lg:pl-[76px]" : "lg:pl-[264px]"
        }`}
      >
        <header className="sticky top-0 z-20 flex min-h-[76px] items-center border-b border-black/10 bg-[#10251e] px-4 text-white lg:bg-[#fbfaf7] lg:px-8 lg:text-[#17231f]">
          <div className="mr-3 lg:hidden">
            <Brand compact />
          </div>

          <div className="min-w-0 flex-1 lg:max-w-[360px]">
            {projectSelector}
          </div>

          <div className="ml-auto flex min-w-0 items-center gap-1.5 sm:gap-3">
            {notificationBell}
            <div className="hidden h-8 w-px bg-black/10 lg:block" />
            <div className="hidden min-w-0 items-center gap-2.5 lg:flex">
              {profileImage}
              <div className="min-w-0 max-w-[160px]">
                <p className="truncate text-xs font-semibold text-[#17231f]">
                  {user?.name || "My account"}
                </p>
                <p className="mt-0.5 truncate text-[10px] text-[#66716d]">
                  Client account
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="flex h-11 w-11 items-center justify-center rounded-md text-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7ea1ff] lg:hidden"
              aria-label="Open navigation"
            >
              <Menu aria-hidden="true" className="h-6 w-6" />
            </button>
          </div>
        </header>

        <div className="hidden h-10 items-center border-b border-black/[0.06] bg-[#fbfaf7] px-8 lg:flex">
          <BellRing
            aria-hidden="true"
            className="mr-2 h-3.5 w-3.5 text-[#66716d]"
          />
          <span className="text-[11px] text-[#66716d]">
            {activeItem?.name || "Client portal"}
          </span>
        </div>

        <main className="client-portal-content mx-auto w-full max-w-[1600px] px-4 py-7 sm:px-6 sm:py-9 lg:px-10 lg:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
