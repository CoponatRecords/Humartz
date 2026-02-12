"use client";

import { Button, Calendar, Input, Label,   Popover,
  PopoverContent,
  PopoverTrigger,cn  } from "@repo/design-system";

import type { Dictionary } from "@repo/internationalization";
import { format } from "date-fns";
import { CalendarIcon, Check, MoveRight, Loader2, CheckCircle2 } from "lucide-react";
import { useState, FormEvent } from "react";

type ContactFormProps = {
  dictionary: Dictionary;
};

export const ContactForm = ({ dictionary }: ContactFormProps) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); // Stop page refresh
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);

    try {
      // Sending to your Formspree endpoint
      const response = await fetch("https://formspree.io/f/mojeaakd", {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        setIsSuccess(true);
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      alert("Error sending message. Check your connection.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full py-20 lg:py-40">
      <div className="container mx-auto max-w-6xl">
        <div className="grid  lg:grid-cols-2">
          {/* LEFT SIDE: Text & Benefits */}
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-4 m-6 p-2">
              <div className="flex flex-col gap-2">
                <h4 className="max-w-xl text-left font-regular text-3xl tracking-tighter md:text-5xl">
                  {dictionary.web.contact.meta.title}
                </h4>
                <p className="max-w-sm text-left text-lg text-muted-foreground leading-relaxed tracking-tight">
                  {dictionary.web.contact.meta.description}
                </p>
              </div>
            </div>
            {dictionary.web.contact.hero.benefits.map((benefit, index) => (
              <div
                className="flex flex-row items-start gap-6 text-left"
                key={index}
              >
                <Check className="mt-2 h-4 w-4 text-primary" />
                <div className="flex flex-col gap-1">
                  <p>{benefit.title}</p>
                  <p className="text-muted-foreground text-sm">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT SIDE: Form or Success Message */}
          <div className="flex items-center justify-center">
            <div className="flex w-full max-w-sm flex-col gap-4 rounded-md border p-8 bg-background shadow-sm">
              
              {isSuccess ? (
                /* --- SUCCESS STATE --- */
                <div className="flex flex-col items-center justify-center text-center py-10 gap-4">
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium">Message Sent!</h3>
                    <p className="text-muted-foreground mt-2 text-sm">
                      Thank you for reaching out. Our team will review your request and get back to you within 24 hours.
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    className="mt-4" 
                    onClick={() => setIsSuccess(false)}
                  >
                    Send another message
                  </Button>
                </div>
              ) : (
                /* --- FORM STATE --- */
                <form onSubmit={onSubmit} className="flex flex-col gap-4">
                  <p className="font-semibold text-lg">{dictionary.web.contact.hero.form.title}</p>
                  
                  

                  {/* First Name */}
                  <div className="grid w-full items-center gap-1">
                    <Label htmlFor="firstname">
                      {dictionary.web.contact.hero.form.firstName}
                    </Label>
                    <Input 
                        id="firstname" 
                        name="firstname" 
                        type="text" 
                        required 
                    />
                  </div>

                  {/* Last Name */}
                  <div className="grid w-full items-center gap-1">
                    <Label htmlFor="lastname">
                      {dictionary.web.contact.hero.form.email}
                    </Label>
                    <Input 
                        id="email" 
                        name="email" 
                        type="email" 
                        required 
                    />
                  </div>

                  {/* --- NEW MESSAGE BOX --- */}
                  <div className="grid w-full items-center gap-1">
                    <Label htmlFor="message">Message</Label>
                    <textarea 
                        id="message" 
                        name="message" 
                        rows={4}
                        placeholder="Tell us about your project..."
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>

                  {/* File Upload
                  <div className="grid w-full items-center gap-1">
                    <Label htmlFor="attachment">
                      {dictionary.web.contact.hero.form.resume}
                    </Label>
                    <Input 
                        id="attachment" 
                        name="attachment" 
                        type="file" 
                    />
                  </div> */}

                  <Button className="w-full gap-4 mt-2" type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>Sending... <Loader2 className="h-4 w-4 animate-spin" /></>
                    ) : (
                      <>
                        {dictionary.web.contact.hero.form.cta}{" "}
                        <MoveRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};