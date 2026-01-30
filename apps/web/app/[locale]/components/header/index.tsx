"use client";

import { ModeToggle } from "@repo/design-system/components/mode-toggle";
import { Button } from "@repo/design-system/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@repo/design-system/components/ui/navigation-menu";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@repo/design-system/components/ui/sheet";
import type { Dictionary } from "@repo/internationalization";
import { Menu, MoveRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { LanguageSwitcher } from "./language-switcher";

type HeaderProps = {
  dictionary: Dictionary;
};

export const Header = ({ dictionary }: HeaderProps) => {
  const navigationItems = [
    {
      title: dictionary.web.header.home,
      href: "/",
    },
    {
      title: dictionary.web.header.whitepaper,
      href: "/whitepaper",
    },
    {
      title: dictionary.web.header.product.title,
      description: dictionary.web.header.product.description,
      items: [
        {
          title: dictionary.web.header.product.pricing,
          href: "/pricing",
        },
      ],
    },
  ];

  const [isOpen, setOpen] = useState(false);

  return (
    <header className="sticky top-0 left-0 z-40 w-full border-b bg-background">
      <div className="container relative mx-auto flex min-h-20 flex-row items-center justify-between lg:grid lg:grid-cols-3">
        
        {/* --- DESKTOP LEFT NAV --- */}
        <div className="hidden lg:flex items-center justify-start gap-4">
          <NavigationMenu>
            <NavigationMenuList className="gap-4">
              {navigationItems.map((item) => (
                <NavigationMenuItem key={item.title}>
                  {item.href ? (
                    <NavigationMenuLink asChild>
                      <Button asChild variant="ghost">
                        <Link href={item.href}>{item.title}</Link>
                      </Button>
                    </NavigationMenuLink>
                  ) : (
                    <>
                      <NavigationMenuTrigger className="text-sm font-medium">
                        {item.title}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent className="!w-[450px] p-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex flex-col justify-between">
                            <div>
                              <p className="text-base font-medium">{item.title}</p>
                              <p className="text-muted-foreground text-sm">{item.description}</p>
                            </div>
                            <Button asChild className="mt-10" size="sm">
                              <Link href="/upload">{dictionary.web.global.primaryCta}</Link>
                            </Button>
                          </div>
                          <div className="flex flex-col justify-end text-sm">
                            {item.items?.map((subItem) => (
                              <NavigationMenuLink
                                className="flex items-center justify-between rounded px-4 py-2 hover:bg-muted"
                                href={subItem.href}
                                key={subItem.title}
                              >
                                <span>{subItem.title}</span>
                                <MoveRight className="h-4 w-4" />
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

        {/* --- LOGO --- */}
        <div className="flex items-center justify-center gap-2">
          <p className="whitespace-nowrap font-semibold text-lg hidden sm:inline">Humartz</p>
          <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
            <path d="M12 2C7.5 2 4 5.5 4 10V16C4 16.55 4.45 17 5 17C5.55 17 6 16.55 6 16V10C6 6.5 8.5 4 12 4C15.5 4 18 6.5 18 10V18C18 18.55 18.45 19 19 19C19.55 19 20 18.55 20 18V10C20 5.5 16.5 2 12 2ZM12 6C9.5 6 7.5 8 7.5 10.5V17C7.5 17.55 7.95 18 8.5 18C9.05 18 9.5 17.55 9.5 17V10.5C9.5 9 10.5 8 12 8C13.5 8 14.5 9 14.5 10.5V16C14.5 16.55 14.95 17 15.5 17C16.05 17 16.5 16.55 16.5 16V10.5C16.5 8 14.5 6 12 6ZM12 10C11.5 10 11 10.5 11 11V16C11 16.55 11.45 17 12 17C12.55 17 13 16.55 13 16V11C13 10.5 12.5 10 12 10Z" fill="currentColor"/>
          </svg>
        </div>

        {/* --- RIGHT ACTIONS / MOBILE TRIGGER --- */}
        <div className="flex items-center justify-end gap-4">
          <div className="hidden lg:flex items-center gap-4">
            <Button asChild variant="ghost">
              <Link href="/contact">{dictionary.web.header.contact}</Link>
            </Button>
            <div className="border-r h-6" />
            <LanguageSwitcher />
            <ModeToggle />
          </div>

          <div className="lg:hidden">
            <Sheet open={isOpen} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px]">
                <SheetHeader className="text-left mb-6">
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>

                <nav className="flex flex-col gap-6">
                  
                  {/* --- MOVE PRIMARY CTA TO TOP --- */}
                  <Button asChild className="w-full h-12 text-md">
                    <Link href="/upload" onClick={() => setOpen(false)}>
                      {dictionary.web.global.primaryCta} {/* "Get Certified" */}
                    </Link>
                  </Button>

                  {/* --- NAVIGATION ITEMS --- */}
                  {navigationItems.map((item) => (
                    <div key={item.title} className="flex flex-col gap-3">
                      {item.href ? (
                        <Link
                          className="flex items-center justify-between text-lg font-medium"
                          href={item.href}
                          onClick={() => setOpen(false)}
                        >
                          {item.title}
                          <MoveRight className="h-4 w-4" />
                        </Link>
                      ) : (
                        <div className="flex flex-col gap-3">
                          {item.items
                            ?.filter(sub => !sub.hideOnMobile)
                            .map((subItem) => (
                              <Link
                                className="flex items-center justify-between text-lg font-medium"
                                href={subItem.href}
                                key={subItem.title}
                                onClick={() => setOpen(false)}
                              >
                                {subItem.title}
                                <MoveRight className="h-4 w-4" />
                              </Link>
                            ))}
                        </div>
                      )}
                    </div>
                  ))}

                  <hr className="my-2" />

                  {/* --- Settings --- */}
                  <div className="flex flex-col gap-5">
                    <div className="flex items-center justify-between px-1">
                      <span className="text-sm font-medium text-muted-foreground">Language</span>
                      <LanguageSwitcher />
                    </div>
                    <div className="flex items-center justify-between px-1">
                      <span className="text-sm font-medium text-muted-foreground">Theme</span>
                      <ModeToggle />
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
