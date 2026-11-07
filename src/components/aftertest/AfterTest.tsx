"use client";

// Shown under the results once a test finishes: rate your provider + save/compare with an account.
import ProviderReviewPrompt from "@/components/reviews/ProviderReviewPrompt";
import AccountPrompt from "@/components/account/AccountPrompt";
import type { FinishedTest } from "./types";

export default function AfterTest({ test }: { test: FinishedTest }) {
  return (
    <div className={`mt-3 grid gap-3 text-start sm:mt-4 ${test.provider ? "lg:grid-cols-2" : ""}`}>
      <ProviderReviewPrompt test={test} />
      <AccountPrompt test={test} />
    </div>
  );
}
