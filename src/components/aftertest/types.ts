// What the speed test hands to the after-test prompts (review + account).
export type FinishedTest = {
  testId: string;
  mode: "full" | "download" | "upload" | "ping";
  download: number | null; // Mbps
  upload: number | null; // Mbps
  ping: number | null; // ms
  jitter: number | null; // ms
  provider: string; // brand name, e.g. "Maroc Telecom" ("" if unknown)
  providerDomain: string; // e.g. "iam.ma" ("" if unknown)
  countryCode: string; // ISO-2 of the connection
  city: string;
  finishedAt: number; // epoch ms
};
