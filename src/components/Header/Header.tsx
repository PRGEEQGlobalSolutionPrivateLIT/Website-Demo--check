"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  navItems,
  type NestedCategory,
  type SimpleLink,
} from "@/data/navigation";

import {
  ChevronDownIcon,
  ChevronUpIcon,
  ChevronRightIcon,
} from "@/components/icons/Icons";

type PanelColumn = {
  title?: string;
  links: SimpleLink[];
};

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function getPanelColumns(categories: NestedCategory[]): PanelColumn[] {
  const columns: PanelColumn[] = [];
  let flatLinks: SimpleLink[] = [];

  function flushFlatLinks() {
    if (flatLinks.length > 0) {
      columns.push({
        links: flatLinks,
      });

      flatLinks = [];
    }
  }

  categories.forEach((category) => {
    if (category.items && category.items.length > 0) {
      flushFlatLinks();

      columns.push({
        title: category.label,
        links: category.items,
      });
    } else {
      flatLinks.push({
        label: category.label,
        href: category.href ?? "#",
      });
    }
  });

  flushFlatLinks();

  return columns;
}

/* -------------------------------------------------------------------------- */
/* Promo Card                                                                 */
/* -------------------------------------------------------------------------- */

function HeaderPromo({ promo }: { promo: PromoCard }) {
  return (
    <div
      className={`nlxp-header-promo nlxp-header-promo--${promo.variant}`}
    >
      {promo.variant === "photo" && promo.image && (
        <div className="nlxp-header-promo-image">
          <Image
            src={promo.image}
            alt={promo.imageAlt ?? ""}
            fill
            sizes="288px"
          />
        </div>
      )}

      <div className="nlxp-header-promo-content">
        <p className="nlxp-header-promo-heading">
          {promo.heading}
        </p>

        {promo.description && (
          <p className="nlxp-header-promo-description">
            {promo.description}
          </p>
        )}

        <Link
          href={promo.buttonHref}
          className="nlxp-header-promo-button"
        >
          {promo.buttonLabel}
        </Link>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Desktop Dropdown                                                           */
/* -------------------------------------------------------------------------- */

function HeaderDropdownPanel({
  triggerEl,
  variant,
  children,
}: {
  triggerEl: HTMLElement | null;
  variant: "simple" | "nested";
  children: ReactNode;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  const [mounted, setMounted] = useState(false);

  const [coords, setCoords] = useState<{
    top: number;
    left?: number;
    right?: number;
  } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    if (!mounted || !triggerEl) {
      return;
    }

    function updatePosition() {
      if (!triggerEl) {
        return;
      }

      const triggerRect = triggerEl.getBoundingClientRect();

      const panelWidth =
        panelRef.current?.getBoundingClientRect().width ?? 0;

      const panelHeight =
        panelRef.current?.getBoundingClientRect().height ?? 0;

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      const margin = 16;
      const gap = 10;

      let left = triggerRect.left;

      /*
       * Keep the dropdown inside the viewport.
       */
      if (left + panelWidth > viewportWidth - margin) {
        left = viewportWidth - panelWidth - margin;
      }

      if (left < margin) {
        left = margin;
      }

      /*
       * Normally dropdown opens below the navigation.
       */
      let top = triggerRect.bottom + gap;

      /*
       * If there isn't enough space below, move it above.
       */
      if (
        top + panelHeight >
        viewportHeight - margin
      ) {
        const topAbove =
          triggerRect.top - panelHeight - gap;

        if (topAbove >= margin) {
          top = topAbove;
        }
      }

      setCoords({
        top,
        left,
        right: undefined,
      });
    }

    updatePosition();

    window.addEventListener("resize", updatePosition);
    window.addEventListener(
      "scroll",
      updatePosition,
      true
    );

    return () => {
      window.removeEventListener(
        "resize",
        updatePosition
      );

      window.removeEventListener(
        "scroll",
        updatePosition,
        true
      );
    };
  }, [triggerEl, mounted]);

  if (!mounted) {
    return null;
  }

  return createPortal(
    <div
      ref={panelRef}
      className={`nlxp-header-panel nlxp-header-panel--${variant}`}
      style={{
        position: "fixed",
        top: coords?.top ?? 0,
        left: coords?.left,
        right: coords?.right,
        visibility: coords ? "visible" : "hidden",
      }}
    >
      {children}
    </div>,
    document.body
  );
}

/* -------------------------------------------------------------------------- */
/* Header                                                                     */
/* -------------------------------------------------------------------------- */

export default function Header() {
  const [openMenu, setOpenMenu] = useState<string | null>(
    null
  );

  const [mobileOpen, setMobileOpen] =
    useState(false);

  const [mobileExpanded, setMobileExpanded] =
    useState<string | null>(null);

  const headerRef = useRef<HTMLElement>(null);

  const triggerRefs = useRef<
    Record<string, HTMLButtonElement | null>
  >({});

  const pathname = usePathname();

  /* ------------------------------------------------------------------------ */
  /* Close menus when route changes                                           */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    setOpenMenu(null);
    setMobileOpen(false);
    setMobileExpanded(null);
  }, [pathname]);

  /* ------------------------------------------------------------------------ */
  /* Click outside + Escape                                                   */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;

      const clickedInsideHeader =
        headerRef.current?.contains(target);

      const clickedInsidePanel =
        target.closest?.(".nlxp-header-panel");

      if (
        !clickedInsideHeader &&
        !clickedInsidePanel
      ) {
        setOpenMenu(null);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpenMenu(null);
        setMobileOpen(false);
        setMobileExpanded(null);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );

      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, []);

  /* ------------------------------------------------------------------------ */
  /* Prevent body scrolling while mobile menu is open                        */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    if (!mobileOpen) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  /* ------------------------------------------------------------------------ */
  /* Menu functions                                                           */
  /* ------------------------------------------------------------------------ */

  function toggleMenu(label: string) {
    setOpenMenu((current) =>
      current === label ? null : label
    );
  }

  function toggleMobileTop(label: string) {
    setMobileExpanded((current) =>
      current === label ? null : label
    );
  }

  function closeMobileMenu() {
    setMobileOpen(false);
    setMobileExpanded(null);
  }

  return (
    <header
      className="nlxp-header"
      ref={headerRef}
    >
      {/* ------------------------------------------------------------------ */}
      {/* Desktop / Tablet Header                                            */}
      {/* ------------------------------------------------------------------ */}

      <div className="nlxp-header-inner">
        {/* Logo */}
        <div className="nlxp-header-logo-area">
          <Link
            href="/"
            className="nlxp-header-logo-link"
            aria-label="NeuroLXP Home"
          >
            <Image
              src="/images/logo_01_synapse_spark.png"
              alt="NeuroLXP"
              width={120}
              height={45}
              className="nlxp-header-logo"
              priority
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav
          className="nlxp-header-nav"
          aria-label="Main navigation"
        >
          {navItems.map((item) => {
            /* ------------------------------------------------------------ */
            /* Normal Link                                                   */
            /* ------------------------------------------------------------ */

            if (item.type === "link") {
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`nlxp-header-link${
                    item.active
                      ? " nlxp-header-link--active"
                      : ""
                  }`}
                >
                  <span>{item.label}</span>

                  {item.arrow === "down" && (
                    <ChevronDownIcon className="nlxp-header-chevron" />
                  )}
                </Link>
              );
            }

            /* ------------------------------------------------------------ */
            /* Dropdown                                                      */
            /* ------------------------------------------------------------ */

            const isOpen =
              openMenu === item.label;

            return (
              <div
                key={item.label}
                className="nlxp-header-dropdown"
              >
                <button
                  type="button"
                  ref={(element) => {
                    triggerRefs.current[item.label] =
                      element;
                  }}
                  className={`nlxp-header-link nlxp-header-dropdown-trigger${
                    isOpen
                      ? " nlxp-header-link--active"
                      : ""
                  }`}
                  onClick={() =>
                    toggleMenu(item.label)
                  }
                  aria-expanded={isOpen}
                  aria-haspopup="true"
                >
                  <span>{item.label}</span>

                  {isOpen ? (
                    <ChevronUpIcon className="nlxp-header-chevron" />
                  ) : (
                    <ChevronDownIcon className="nlxp-header-chevron" />
                  )}
                </button>

                {/* Simple dropdown */}
                {isOpen &&
                  item.type === "simple" && (
                    <HeaderDropdownPanel
                      triggerEl={
                        triggerRefs.current[
                          item.label
                        ]
                      }
                      variant="simple"
                    >
                      <div className="nlxp-header-column">
                        <div className="nlxp-header-column-links">
                          {item.items.map(
                            (link) => (
                              <Link
                                key={link.label}
                                href={link.href}
                                className="nlxp-header-panel-link"
                                onClick={() =>
                                  setOpenMenu(null)
                                }
                              >
                                {link.label}
                              </Link>
                            )
                          )}
                        </div>
                      </div>

                      {item.promo && (
                        <HeaderPromo
                          promo={item.promo}
                        />
                      )}
                    </HeaderDropdownPanel>
                  )}

                {/* Nested dropdown */}
                {isOpen &&
                  item.type === "nested" && (
                    <HeaderDropdownPanel
                      triggerEl={
                        triggerRefs.current[
                          item.label
                        ]
                      }
                      variant="nested"
                    >
                      <div className="nlxp-header-columns">
                        {getPanelColumns(
                          item.categories
                        ).map(
                          (column, index) => (
                            <div
                              key={
                                column.title ??
                                `column-${index}`
                              }
                              className="nlxp-header-column"
                            >
                              {column.title && (
                                <p className="nlxp-header-column-title">
                                  {
                                    column.title
                                  }
                                </p>
                              )}

                              <div className="nlxp-header-column-links">
                                {column.links.map(
                                  (link) => (
                                    <Link
                                      key={
                                        link.label
                                      }
                                      href={
                                        link.href
                                      }
                                      className="nlxp-header-panel-link"
                                      onClick={() =>
                                        setOpenMenu(
                                          null
                                        )
                                      }
                                    >
                                      {
                                        link.label
                                      }
                                    </Link>
                                  )
                                )}
                              </div>
                            </div>
                          )
                        )}
                      </div>

                      {item.promo && (
                        <HeaderPromo
                          promo={item.promo}
                        />
                      )}
                    </HeaderDropdownPanel>
                  )}
              </div>
            );
          })}
        </nav>

        {/* Sign In */}
        <Link
          href="/signin"
          className="nlxp-header-signin"
        >
          Sign in Help
        </Link>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className={`nlxp-header-burger${
            mobileOpen
              ? " nlxp-header-burger--open"
              : ""
          }`}
          onClick={() =>
            setMobileOpen((current) => !current)
          }
          aria-label={
            mobileOpen
              ? "Close menu"
              : "Open menu"
          }
          aria-expanded={mobileOpen}
          aria-controls="nlxp-mobile-menu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Mobile Navigation                                                  */}
      {/* ------------------------------------------------------------------ */}

      {mobileOpen && (
        <div
          id="nlxp-mobile-menu"
          className="nlxp-header-mobile-panel"
        >
          <div className="nlxp-header-mobile-content">
            {navItems.map((item) => {
              /* ---------------------------------------------------------- */
              /* Mobile normal link                                          */
              /* ---------------------------------------------------------- */

              if (item.type === "link") {
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`nlxp-header-mobile-link${
                      item.active
                        ? " nlxp-header-mobile-link--active"
                        : ""
                    }`}
                    onClick={
                      closeMobileMenu
                    }
                  >
                    <span>{item.label}</span>

                    <ChevronRightIcon className="nlxp-header-chevron-right" />
                  </Link>
                );
              }

              const isExpanded =
                mobileExpanded ===
                item.label;

              return (
                <div
                  key={item.label}
                  className="nlxp-header-mobile-group"
                >
                  {/* Top-level mobile item */}
                  <button
                    type="button"
                    className={`nlxp-header-mobile-link nlxp-header-mobile-trigger${
                      isExpanded
                        ? " nlxp-header-mobile-link--active"
                        : ""
                    }`}
                    onClick={() =>
                      toggleMobileTop(
                        item.label
                      )
                    }
                    aria-expanded={isExpanded}
                  >
                    <span>{item.label}</span>

                    <ChevronRightIcon
                      className={`nlxp-header-chevron-right${
                        isExpanded
                          ? " nlxp-header-chevron-right--open"
                          : ""
                      }`}
                    />
                  </button>

                  {/* Simple submenu */}
                  {isExpanded &&
                    item.type ===
                      "simple" && (
                      <div className="nlxp-header-mobile-sublist">
                        {item.items.map(
                          (link) => (
                            <Link
                              key={
                                link.label
                              }
                              href={
                                link.href
                              }
                              className="nlxp-header-mobile-sublink"
                              onClick={
                                closeMobileMenu
                              }
                            >
                              {
                                link.label
                              }
                            </Link>
                          )
                        )}
                      </div>
                    )}

                  {/* Nested submenu */}
                  {isExpanded &&
                    item.type ===
                      "nested" && (
                      <div className="nlxp-header-mobile-sublist">
                        {getPanelColumns(
                          item.categories
                        ).map(
                          (
                            column,
                            index
                          ) => (
                            <div
                              key={
                                column.title ??
                                `column-${index}`
                              }
                              className="nlxp-header-mobile-column"
                            >
                              {column.title && (
                                <p className="nlxp-header-mobile-column-title">
                                  {
                                    column.title
                                  }
                                </p>
                              )}

                              {column.links.map(
                                (link) => (
                                  <Link
                                    key={
                                      link.label
                                    }
                                    href={
                                      link.href
                                    }
                                    className="nlxp-header-mobile-sublink"
                                    onClick={
                                      closeMobileMenu
                                    }
                                  >
                                    {
                                      link.label
                                    }
                                  </Link>
                                )
                              )}
                            </div>
                          )
                        )}
                      </div>
                    )}
                </div>
              );
            })}

            {/* Mobile sign in */}
            <div className="nlxp-header-mobile-signin-row">
              <Link
                href="/signin"
                className="nlxp-header-mobile-signin"
                onClick={
                  closeMobileMenu
                }
              >
                Sign in Help
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
