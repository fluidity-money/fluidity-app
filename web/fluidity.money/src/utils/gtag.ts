// export const GA_DEST_ID = 'G-EF68MNJRJ7';
// export const GA_TRACKING_ID = 'GT-NM2HFZW';

export const GTAG_ID = "G-EF68MNJRJ7";
export const GTM_ID = "GTM-W7QJGR2";

export const pageview = (url: URL) => {
  if (typeof window.gtag === "undefined") return;

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
  if (typeof window.gtag === "undefined") return;

  window.gtag("event", action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};
