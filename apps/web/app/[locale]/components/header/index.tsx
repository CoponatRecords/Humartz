"use client";

import {
  ModeToggle,
  Button,
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@repo/design-system";
import { cn } from "@repo/design-system";
import type { Dictionary } from "@repo/internationalization";
import { Menu, MoveRight, User, ShieldCheck, LayoutDashboard, LogIn } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LanguageSwitcher } from "./language-switcher";
import { SearchTrigger, SearchProvider } from "../../(home)/components/search-command";
// Clerk Auth
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/nextjs";

type SubNavItem = { title: string; href: string; hideOnMobile?: boolean };
type NavItem = { 
  title: string; 
  href?: string; 
  description?: string; 
  items?: SubNavItem[] 
};

type HeaderProps = { 
  dictionary: Dictionary 
};

export const Header = ({ dictionary }: HeaderProps) => {
  const pathname = pathnameHook();
  const [isOpen, setOpen] = useState(false);
  
  const { user } = useUser();
  const isAdmin = user?.publicMetadata?.role === "admin";

  const isHome = pathname === "/" || /^\/(fr|en)(\/)?$/.test(pathname ?? "");
  const dynamicLink = isHome
    ? { title: dictionary.web.header.whitepaper, href: "/whitepaper" }
    : { title: dictionary.web.header.home, href: "/" };

  // Navigation items updated with Contact
  const navigationItems: NavItem[] = [
    { title: dictionary.web.header.pricing, href: "/pricing" },
        { 
      title: dictionary.web.header.contact || "Contact", 
      href: "/contact" 
    },
    {
      title: dictionary.web.header.product.title,
      description: dictionary.web.header.product.description,
      items: [{ title: dictionary.web.header.dashboard, href: "/dashboard" }],
    },

  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="mx-auto flex w-full items-center justify-between py-2 px-4 lg:grid lg:grid-cols-[auto_1fr_auto]">
        
        {/* LOGO SECTION */}
        <div className="flex items-left ml-3 sm:ml-1">
          <Link href="/" className="flex items-center gap-2">
            <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 2C7.5 2 4 5.5 4 10V16C4 16.55 4.45 17 5 17C5.55 17 6 16.55 6 16V10C6 6.5 8.5 4 12 4C15.5 4 18 6.5 18 10V18C18 18.55 18.45 19 19 19C19.55 19 20 18.55 20 18V10C20 5.5 16.5 2 12 2ZM12 6C9.5 6 7.5 8 7.5 10.5V17C7.5 17.55 7.95 18 8.5 18C9.05 18 9.5 17.55 9.5 17V10.5C9.5 9 10.5 8 12 8C13.5 8 14.5 9 14.5 10.5V16C14.5 16.55 14.95 17 15.5 17C16.05 17 16.5 16.55 16.5 16V10.5C16.5 8 14.5 6 12 6ZM12 10C11.5 10 11 10.5 11 11V16C11 16.55 11.45 17 12 17C12.55 17 13 16.55 13 16V11C13 10.5 12.5 10 12 10Z" fill="currentColor" />
            </svg>
            <span className="hidden sm:inline text-lg font-bold">Humartz</span>
          </Link>
        </div>

        {/* DESKTOP NAVIGATION */}
        <div className="hidden lg:flex justify-left ml-3">
          <NavigationMenu>
            <NavigationMenuList className="gap-2">
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Button asChild variant="ghost" className="text-muted-foreground">
                    <Link href={dynamicLink.href}>{dynamicLink.title}</Link>
                  </Button>
                </NavigationMenuLink>
              </NavigationMenuItem>

              {navigationItems.map((item) => (
                <NavigationMenuItem key={item.title}>
                  {item.href ? (
                    <NavigationMenuLink asChild>
                      <Button asChild variant="ghost" className="text-muted-foreground">
                        <Link href={item.href}>{item.title}</Link>
                      </Button>
                    </NavigationMenuLink>
                  ) : (
                    <>
                      <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
                      <NavigationMenuContent className="w-112.5! p-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex flex-col justify-between">
                            <div>
                              <p className="text-base font-medium">{item.title}</p>
                              <p className="text-sm text-muted-foreground">{item.description}</p>
                            </div>
                            <Button asChild className="mt-5" size="sm">
                              <Link href="/get-certified">{dictionary.web.global.primaryCta}</Link>
                            </Button>
                          </div>
                          <div className="flex flex-col justify-end text-sm">
                            {item.items?.map((subItem) => (
                              <NavigationMenuLink
                                key={subItem.title}
                                href={subItem.href}
                                className="flex items-center justify-between rounded px-4 py-2 hover:bg-muted border-0.3 border-white/50 hover:border-white/20 transition-colors"
                              >
                                <span>{subItem.title}</span>
                              </NavigationMenuLink>
                            ))}
                          </div>
                        </div>
                      </NavigationMenuContent>
                    </>
                  )}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* RIGHT SIDE ACTIONS */}
        <div className="flex items-center justify-end gap-3 min-w-fit">
          <div className="hidden lg:flex items-center gap-3">
            
            <SignedIn>
              {isAdmin && (
                <Button asChild variant="outline" size="sm" className="gap-2 border-primary/20 bg-primary/5 hover:bg-primary/10">
                  <Link href="/admin">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    {dictionary.web.header.admin}
                  </Link>
                </Button>
              )}
            </SignedIn>

            <SearchProvider>
              <SearchTrigger />
            </SearchProvider>
            
            <div className="h-6 border-r mx-1" />
            <LanguageSwitcher />
            {/* <ModeToggle /> */}
            <div className="h-6 border-r mx-1" />

            <SignedOut>
              <SignInButton mode="modal" fallbackRedirectUrl="/dashboard">
                <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-primary">
                  <LayoutDashboard className="h-4 w-4" />
                  {dictionary.web.header.dashboard}
                </Button>
              </SignInButton>
              
              <SignInButton mode="modal" fallbackRedirectUrl="/dashboard">

              
                <Button size="sm" variant="default"><LogIn className="h-3 w-3" />{dictionary.web.header.signIn}</Button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <Button asChild variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-primary">
                <Link href="/dashboard">
                  <LayoutDashboard className="h-4 w-4" />
                  {dictionary.web.header.dashboard}
                </Link>
              </Button>
              <UserButton 
                afterSignOutUrl="/" 
                appearance={{ elements: { userButtonAvatarBox: "h-8 w-8" } }}
              />
            </SignedIn>
          </div>

          {/* MOBILE MENU TRIGGER */}
          <div className="lg:hidden flex items-center gap-2">
            <SignedIn>
               <UserButton afterSignOutUrl="/" />
            </SignedIn>
            
            <Sheet open={isOpen} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 pt-16 flex flex-col">
                <nav className="flex flex-col gap-8 h-full">
                  
                  <div className="flex flex-col gap-3">
                    <SignedOut>
                      <SignInButton mode="modal">
                        <Button className="w-full h-12 text-md" onClick={() => setOpen(false)}>
                          {dictionary.web.header.signIn}
                        </Button>
                      </SignInButton>
                    </SignedOut>
                    <Button asChild variant="outline" className="w-full h-12 text-md p-2" onClick={() => setOpen(false)}>
                      <Link href="/get-certified">{dictionary.web.global.primaryCta}</Link>
                    </Button>
                  </div>

                  <div className="flex flex-col gap-6 px-2">
                    <SignedIn>
                      {isAdmin && (
                        <Link href="/admin" onClick={() => setOpen(false)} className="text-xl font-bold text-primary flex items-center justify-between">
                          {dictionary.web.header.admin}
                          <ShieldCheck className="h-5 w-5" />
                        </Link>
                      )}
                      <Link href="/dashboard" onClick={() => setOpen(false)} className="text-xl font-bold text-primary flex items-center justify-between">
                        {dictionary.web.header.dashboard}
                        <LayoutDashboard className="h-5 w-5" />
                      </Link>
                    </SignedIn>

                    <SignedOut>
                      <SignInButton mode="modal" fallbackRedirectUrl="/dashboard">
                        <button onClick={() => setOpen(false)} className="text-xl font-medium tracking-tight hover:text-primary transition-colors flex items-center justify-between w-full text-left">
                          {dictionary.web.header.dashboard}
                          <LayoutDashboard className="h-4 w-4" />
                        </button>
                      </SignInButton>
                    </SignedOut>

                    <Link href={dynamicLink.href} onClick={() => setOpen(false)} className="text-xl font-medium tracking-tight hover:text-primary transition-colors flex items-center justify-between">
                      {dynamicLink.title}
                      <MoveRight className="h-4 w-4" />
                    </Link>

                    {navigationItems.map((item) => (
                      <Link key={item.title} href={item.href || "#"} onClick={() => setOpen(false)} className="text-xl font-medium tracking-tight hover:text-primary transition-colors flex items-center justify-between">
                        {item.title}
                        <MoveRight className="h-4 w-4" />
                      </Link>
                    ))}

                    <div className="pt-2">
                      <SearchProvider>
                        <SearchTrigger className="w-full justify-start text-muted-foreground" />
                      </SearchProvider>
                    </div>
                  </div>

                  <div className="mt-auto pt-6 border-t px-2 flex items-center justify-between">
                    <div className="flex gap-2">
                      {/* <ModeToggle /> */}
                      <LanguageSwitcher />
                    </div>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

function pathnameHook() {
  try { return usePathname(); } catch { return "/"; }
}