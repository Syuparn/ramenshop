import { createSystem, defaultConfig } from "@chakra-ui/react";

const theme = createSystem(defaultConfig, {
  globalCss: {
    body: {
      backgroundColor: "gray.300",
      color: "gray.800",
      fontSize: "6xl",
    },
  },
});

export default theme;
