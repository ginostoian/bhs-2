"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  Archive,
  BarChart3,
  Bell,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  ChevronDown,
  ClipboardCheck,
  Clock3,
  CreditCard,
  Database,
  FileClock,
  FilePlus2,
  FileText,
  FolderOpen,
  Image,
  Inbox,
  LayoutDashboard,
  Mail,
  Menu,
  Package,
  Paintbrush,
  PanelLeftClose,
  PanelLeftOpen,
  ReceiptText,
  RefreshCw,
  Settings,
  TicketCheck,
  UserCog,
  Users,
  Wrench,
  X,
} from "lucide-react";

const ICONS = {
  archive: Archive,
  attendance: Clock3,
  calendar: CalendarDays,
  changes: RefreshCw,
  contractors: Wrench,
  crm: BarChart3,
  dashboard: LayoutDashboard,
  database: Database,
  documents: FileText,
  email: Mail,
  employees: UserCog,
  files: FolderOpen,
  forms: Inbox,
  instructions: ClipboardCheck,
  invoices: ReceiptText,
  moodboards: Paintbrush,
  notifications: Bell,
  payments: CreditCard,
  photos: Image,
  products: Package,
  projects: Building2,
  quote: FilePlus2,
  quotes: FileClock,
  settings: Settings,
  tasks: ClipboardCheck,
  tickets: TicketCheck,
  users: Users,
  workers: BriefcaseBusiness,
};

function isItemActive(pathname, href, exact = false) {
  if (exact) return pathname === href;

  if (href === "/dashboard" || href === "/admin/dashboard") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function Brand({ compact = false, workspaceLabel }) {
  return (
    <Link
      href="/"
      className="group flex min-w-0 items-center gap-3 text-white hover:text-white"
      aria-label="Better Homes home"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-white/20 font-serif text-[15px] tracking-tight text-white transition-colors group-hover:border-white/40">
        BH
      </span>
      {!compact && (
        <span className="min-w-0">
          <span className="block truncate text-[13px] font-semibold uppercase tracking-[0.18em] text-white">
            Better Homes
          </span>
          <span className="mt-0.5 block truncate text-[11px] text-slate-400">
            {workspaceLabel}
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
      className={`group relative flex h-10 items-center rounded-md text-[13px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#101b2b] ${
        collapsed ? "justify-center px-2" : "gap-3 px-3"
      } ${
        active
          ? "bg-white/10 text-white"
          : "text-slate-300 hover:bg-white/[0.06] hover:text-white"
      }`}
    >
      {active && (
        <span className="absolute inset-y-2 left-0 w-0.5 rounded-r-full bg-blue-400" />
      )}
      <Icon
        aria-hidden="true"
        className={`h-[17px] w-[17px] shrink-0 ${
          active ? "text-blue-300" : "text-slate-400 group-hover:text-slate-200"
        }`}
        strokeWidth={1.8}
      />
      {!collapsed && <span className="truncate">{item.name}</span>}
    </Link>
  );
}

function NavGroup({ group, collapsed, onNavigate, defaultOpen }) {
  const pathname = usePathname();
  const containsActiveItem = group.items.some((item) =>
    isItemActive(pathname, item.href, item.exact),
  );
  const [isOpen, setIsOpen] = useState(defaultOpen || containsActiveItem);

  useEffect(() => {
    if (containsActiveItem) setIsOpen(true);
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
      <div className="space-y-1 border-t border-white/[0.07] pt-3">
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
        onClick={() => setIsOpen((open) => !open)}
        className="mb-1 flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500 transition-colors hover:text-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
        aria-expanded={isOpen}
      >
        {group.name}
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen && (
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
      )}
    </div>
  );
}

function Sidebar({
  navGroups,
  collapsed,
  mobile,
  onNavigate,
  onToggleCollapsed,
  workspaceLabel,
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
      className={`flex h-full flex-col border-r border-white/[0.07] bg-[#101b2b] text-white ${
        mobile ? "w-[284px]" : collapsed ? "w-[76px]" : "w-[264px]"
      } transition-[width] duration-200`}
    >
      <div
        className={`flex h-[72px] shrink-0 items-center border-b border-white/[0.07] ${
          collapsed && !mobile ? "justify-center px-3" : "px-5"
        }`}
      >
        <Brand compact={collapsed && !mobile} workspaceLabel={workspaceLabel} />
      </div>

      <nav
        className={`flex-1 space-y-4 overflow-y-auto py-5 ${
          collapsed && !mobile ? "px-2.5" : "px-3"
        }`}
        aria-label={`${workspaceLabel} navigation`}
      >
        {navGroups.map((group, index) => (
          <NavGroup
            key={group.name || `primary-${index}`}
            group={group}
            collapsed={collapsed && !mobile}
            onNavigate={onNavigate}
            defaultOpen={group.defaultOpen}
          />
        ))}
      </nav>

      <div className="shrink-0 border-t border-white/[0.07] p-3">
        <div
          className={`flex items-center ${
            collapsed && !mobile ? "justify-center" : "gap-3 px-2"
          } py-2`}
          title={collapsed && !mobile ? user?.name || user?.email : undefined}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-700 text-[11px] font-semibold text-white ring-1 ring-white/15">
            {initials}
          </div>
          {(!collapsed || mobile) && (
            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-white">
                {user?.name || "Account"}
              </p>
              <p className="mt-0.5 truncate text-[10px] text-slate-400">
                {user?.email}
              </p>
            </div>
          )}
        </div>
        {!mobile && (
          <button
            type="button"
            onClick={onToggleCollapsed}
            className={`mt-2 flex h-9 w-full items-center rounded-md text-xs text-slate-400 transition-colors hover:bg-white/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${
              collapsed ? "justify-center" : "gap-3 px-3"
            }`}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <PanelLeftOpen className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
            {!collapsed && <span>Collapse sidebar</span>}
          </button>
        )}
      </div>
    </aside>
  );
}

export default function PortalShell({
  children,
  navGroups,
  user,
  workspaceLabel,
  headerActions,
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
    <div className="min-h-screen bg-[#f4f6f8] font-[Satoshi] text-slate-900">
      <div className="fixed inset-y-0 left-0 z-30 hidden lg:block">
        <Sidebar
          navGroups={navGroups}
          collapsed={collapsed}
          onToggleCollapsed={() => setCollapsed((value) => !value)}
          workspaceLabel={workspaceLabel}
          user={user}
        />
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-slate-950/55 backdrop-blur-[2px]"
            aria-label="Close navigation"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative h-full w-[284px] shadow-2xl">
            <Sidebar
              navGroups={navGroups}
              collapsed={false}
              mobile
              onNavigate={() => setMobileOpen(false)}
              workspaceLabel={workspaceLabel}
              user={user}
            />
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="absolute right-3 top-5 flex h-9 w-9 items-center justify-center rounded-md text-slate-300 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              aria-label="Close navigation"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      <div
        className={`min-h-screen transition-[padding] duration-200 ${
          collapsed ? "lg:pl-[76px]" : "lg:pl-[264px]"
        }`}
      >
        <header className="sticky top-0 z-20 flex h-[72px] items-center border-b border-slate-200/90 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="mr-3 flex h-10 w-10 items-center justify-center rounded-md text-slate-600 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 lg:hidden"
            aria-label="Open navigation"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="min-w-0">
            <h1 className="truncate text-base font-semibold tracking-[-0.01em] text-slate-950 sm:text-lg">
              {activeItem?.name || workspaceLabel}
            </h1>
            <p className="hidden text-[11px] text-slate-500 sm:block">
              {workspaceLabel}
            </p>
          </div>

          <div className="ml-auto flex min-w-0 items-center gap-2 sm:gap-3">
            {headerActions}
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1680px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
