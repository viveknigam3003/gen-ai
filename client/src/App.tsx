import { Box, Title } from "@mantine/core";
import React from "react";
import { createStyles } from "@mantine/core";

function App() {
  const { classes } = useStyles();

  return (
    <Box className={classes.root}>
      <Title>Generative AI</Title>
    </Box>
  );
}

export default App;

const useStyles = createStyles((theme) => ({
  root: {},
}));
