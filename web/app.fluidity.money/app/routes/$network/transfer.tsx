import { LinkButton, useViewport } from "@fluidity-money/surfing";
import { LinksFunction } from "@remix-run/node";
import { Link, Outlet, useParams } from "@remix-run/react";
import transferStyles from "~/styles/transfer.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: transferStyles }];
};

const Transfer = () => {
  const { network } = useParams();

  const mobileWidthBreakpoint = 768;
  const { width } = useViewport();
  const isMobile = width < mobileWidthBreakpoint;

  return (
    <div className={`transfer-template ${isMobile ? "mobile" : ""}`}>
      <header className="transfer-template-header">
        {!isMobile && (
          <div id="flu-logo">
            <Link to={"../dashboard/home"}>
              <img
                style={{ width: "5.5em", height: "2.5em" }}
                src="https://app-cdn.fluidity.money/images/outlinedLogo.svg"
                alt="Fluidity"
              />
            </Link>
          </div>
        )}
        <Link to={`/${network}/dashboard/home`}>
          <LinkButton
            handleClick={() => {
              return;
            }}
            size={isMobile ? "medium" : "large"}
            type="internal"
            left={true}
            className="cancel-btn"
          >
            Cancel
          </LinkButton>
        </Link>
      </header>
      <Outlet />
    </div>
  );
};

export default Transfer;
