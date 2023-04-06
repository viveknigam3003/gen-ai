import { Center, createStyles, Title } from "@mantine/core";
import React from "react";

function App() {
  const { classes } = useStyles();

  return (
    <Center className={classes.root}>
      <Title>Generative AI</Title>
    </Center>
  );
}

export default App;

const useStyles = createStyles(() => ({
  root: {
    padding: 20,
  },
}));
