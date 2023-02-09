export const GTAG_ID = process.env["FLU_GTAG_ID"];
export const GTM_ID = process.env["FLU_GTM_ID"];

export const pageview = (url: URL) => {
  if (typeof window?.gtag === "undefined") return;

  window.gtag("config", GTAG_ID, {
    page_path: url,
  });
};

type GTagEvent = {
  action: string;
  category: string;
  label: string;
  value: number;
};

export const event = ({ action, category, label, value }: GTagEvent) => {
  if (typeof window?.gtag === "undefined") return;

  window.gtag("event", action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};
