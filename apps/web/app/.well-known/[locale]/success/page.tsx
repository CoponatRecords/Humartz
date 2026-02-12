"use client";

import { Button } from "@repo/design-system";
import { CheckCircle2, Mail, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion"; // Optional: for a smooth entrance

export default function SuccessPage({ params: { locale } }: { params: { locale: string } }) {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-6 py-20">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex w-full max-w-md flex-col items-center text-center"
      >
        {/* Success Icon */}
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10 text-green-500">
          <CheckCircle2 className="h-12 w-12" />
        </div>

        {/* Title */}
        <h1 className="mb-2 text-3xl font-bold tracking-tight md:text-4xl">
          Upload Successful!
        </h1>
        <p className="mb-8 text-lg text-muted-foreground">
          Your project files have been received and are ready for processing.
        </p>

        {/* Info Cards */}
        <div className="grid w-full gap-4 mb-10">
          <div className="flex items-start gap-4 rounded-lg border bg-card p-4 text-left shadow-sm">
            <Mail className="mt-1 h-5 w-5 text-primary shrink-0" />
            <div>
              <p className="font-semibold">Check your inbox and dashboardin 24 hours</p>
              <p className="text-sm text-muted-foreground">We will send you a confirmation email once processing is complete.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 rounded-lg border bg-card p-4 text-left shadow-sm">
            <Clock className="mt-1 h-5 w-5 text-primary shrink-0" />
            <div>
              <p className="font-semibold">Processing Time</p>
              <p className="text-sm text-muted-foreground">Our engineers typically review files within 24-48 hours.</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex w-full flex-col gap-3">
          <Button asChild size="lg" className="w-full">
            <Link href={`/get-certified`}>
              Upload a new track<ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="ghost" className="w-full">
            <Link href={`https://humartz.com/`}>
              Return Home
            </Link>
          </Button>
        </div>

        {/* Footer Support */}
        <p className="mt-12 text-sm text-muted-foreground">
          Need help ? Contact us at <a href="mailto:contact@humartz.com" className="text-primary hover:underline">contact@humartz.com</a>
        </p>
      </motion.div>
    </div>
  );
}