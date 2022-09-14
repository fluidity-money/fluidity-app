import type { FallbackRender } from "@sentry/react";

import { Display, Text } from "@fluidity-money/surfing";

type ErrorProps = {
  error: Error;
  componentStack: string | null;
  eventId: string | null;
  resetError: () => void;
};

const Error: FallbackRender = ({ error, resetError }: ErrorProps) => {
  return (
    <>
      <Display>Error</Display>
      <Display small>Something has done the unexpected.</Display>

      <Text>
        We&apos;ve been notified automagically.
        <br />
        If it&apos;s urgent. Contact us on{" "}
        <a
          href="https://discord.gg/fluidity"
          target={"_blank"}
          rel={"noopener noreferrer"}
        >
          Discord
        </a>
        .<br />
        Otherwise, we&apos;ll solve this as soon as we can.
        <hr />
        <div>{error.toString()}</div>
      </Text>

      <button onClick={resetError}>Retry</button>
    </>
  );
};
export default Error;
