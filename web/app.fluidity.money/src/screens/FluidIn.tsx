import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";

const FluidIn = () => {
  const { assetId } = useParams();
  return (
    <>
      FluidIn
      <Helmet>
        <title>Fluidify your {assetId} - Fluidity</title>
      </Helmet>
    </>
  );
};
export default FluidIn;
