export const GA_TRACKING_ID = process.env["GA_WEBSITE_ANALYTICS_ID"];

export const pageview = (url: URL) => {
  if (typeof window.gtag === "undefined") return;

  window.gtag("config", GA_TRACKING_ID, {
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
  if (typeof window.gtag === "undefined") return;

  window.gtag("event", action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};
