import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";

const FluidOut = () => {
  const { assetId } = useParams();
  return (
    <>
      <Helmet>
        <title>Defluidify your {assetId} - Fluidity</title>
      </Helmet>
    </>
  );
};
export default FluidOut;
