import { motion } from "framer-motion";

//type LoadingTextProps = unknown

const LoadingText = () => {
  return (
    <motion.div
      style={{
        height: "100%",
        width: "100px",
      }}
      animate={{
        backgroundColor: [
          "linear-gradient(90deg, rgba(207,207,207,1) 0%, rgba(207,207,207,0) 100%)",
          "linear-gradient(90deg, rgba(207,207,207,0) 0%, rgba(207,207,207,1) 100%)",
          "linear-gradient(90deg, rgba(207,207,207,0) 0%, rgba(207,207,207,0) 100%)",
        ],
      }}
    />
  );
};

export default LoadingText;
