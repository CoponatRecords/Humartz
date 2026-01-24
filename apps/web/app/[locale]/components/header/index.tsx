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
import type { Dictionary } from "@repo/internationalization";
import { CommandIcon, Menu, MoveRight, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { env } from "@/env";
import { LanguageSwitcher } from "./language-switcher";

type HeaderProps = {
  dictionary: Dictionary;
};

export const Header = ({ dictionary }: HeaderProps) => {
  // --- UPDATED NAVIGATION ITEMS ---
  const navigationItems = [
    {
      title: dictionary.web.header.home,
      href: "/",
      description: "",
    },
    {
      title: dictionary.web.header.whitepaper,
      href: "/whitepaper",
      description: "Read the technical protocol.",
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
      <div className="container relative mx-auto flex min-h-20 flex-row items-center gap-4 lg:grid lg:grid-cols-3">
        <div className="hidden flex-row items-center justify-start gap-4 lg:flex">
          <NavigationMenu className="flex items-start justify-start">
            <NavigationMenuList className="flex flex-row justify-start gap-4">
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
                      <NavigationMenuTrigger className="font-medium text-sm">
                        {item.title}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent className="!w-[450px] p-4">
                        <div className="flex grid-cols-2 flex-col gap-4 lg:grid">
                          <div className="flex h-full flex-col justify-between">
                            <div className="flex flex-col">
                              <p className="text-base">{item.title}</p>
                              <p className="text-muted-foreground text-sm">
                                {item.description}
                              </p>
                            </div>
                            <Button asChild className="mt-10" size="sm">
                              <Link href="/contact">
                                {dictionary.web.global.primaryCta}
                              </Link>
                            </Button>
                          </div>
                          <div className="flex h-full flex-col justify-end text-sm">
                            {item.items?.map((subItem, idx) => (
                              <NavigationMenuLink
                                className="flex flex-row items-center justify-between rounded px-4 py-2 hover:bg-muted"
                                href={subItem.href}
                                key={idx}
                              >
                                <span>{subItem.title}</span>
                                <MoveRight className="h-4 w-4 text-muted-foreground" />
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
        <div className="container relative mx-auto min-h-20 grid items-center grid-cols-3 gap-4">
  {/* Left: Desktop Nav */}
  <div className="hidden lg:flex items-center justify-start gap-4">
    {/* NavigationMenu code */}
  </div>

  {/* Center: Logo */}
  {/* Center: Logo */}
<div className="flex items-center justify-center gap-2">
  <p className="whitespace-nowrap font-semibold text-lg hidden sm:inline">
    Humartz
  </p>
  <svg
    className="h-5 w-5 fill-current"
    fill="none"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>Humartz Fingerprint</title>
    <path
      d="M12 2C7.5 2 4 5.5 4 10V16C4 16.55 4.45 17 5 17C5.55 17 6 16.55 6 16V10C6 6.5 8.5 4 12 4C15.5 4 18 6.5 18 10V18C18 18.55 18.45 19 19 19C19.55 19 20 18.55 20 18V10C20 5.5 16.5 2 12 2ZM12 6C9.5 6 7.5 8 7.5 10.5V17C7.5 17.55 7.95 18 8.5 18C9.05 18 9.5 17.55 9.5 17V10.5C9.5 9 10.5 8 12 8C13.5 8 14.5 9 14.5 10.5V16C14.5 16.55 14.95 17 15.5 17C16.05 17 16.5 16.55 16.5 16V10.5C16.5 8 14.5 6 12 6ZM12 10C11.5 10 11 10.5 11 11V16C11 16.55 11.45 17 12 17C12.55 17 13 16.55 13 16V11C13 10.5 12.5 10 12 10Z"
      fill="currentColor"
    />
  </svg>
</div></div>



        <div className="flex w-full justify-end gap-4">
          <Button asChild className="hidden md:inline" variant="ghost">
            <Link href="/contact">{dictionary.web.header.contact}</Link>
          </Button>
          <div className="hidden border-r md:inline" />
          <div className="hidden md:inline">
            <LanguageSwitcher />
          </div>
          <div className="hidden md:inline">
            <ModeToggle />
          </div>
        </div>
        <div className="flex w-12 shrink items-end justify-end lg:hidden">
          <Button onClick={() => setOpen(!isOpen)} variant="ghost">
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          {isOpen && (
            <div className="container absolute top-20 right-0 flex w-full flex-col gap-8 border-t bg-background py-4 shadow-lg">
              {navigationItems.map((item) => (
                <div key={item.title}>
                  <div className="flex flex-col gap-2">
                    {item.href ? (
                      <Link
                        className="flex items-center justify-between"
                        href={item.href}
                        rel={
                          item.href.startsWith("http")
                            ? "noopener noreferrer"
                            : undefined
                        }
                        target={
                          item.href.startsWith("http") ? "_blank" : undefined
                        }
                      >
                        <span className="text-lg">{item.title}</span>
                        <MoveRight className="h-4 w-4 stroke-1 text-muted-foreground" />
                      </Link>
                    ) : (
                      <p className="text-lg">{item.title}</p>
                    )}
                    {item.items?.map((subItem) => (
                      <Link
                        className="flex items-center justify-between"
                        href={subItem.href}
                        key={subItem.title}
                      >
                        <span className="text-muted-foreground">
                          {subItem.title}
                        </span>
                        <MoveRight className="h-4 w-4 stroke-1" />
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};