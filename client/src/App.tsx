import {
  Center,
  createStyles,
  Image,
  SimpleGrid,
  Stack,
  Textarea,
  Title,
} from "@mantine/core";
import { getHotkeyHandler } from "@mantine/hooks";
import axios from "axios";
import React from "react";

function App() {
  const { classes } = useStyles();
  const [promptValue, setPromptValue] = React.useState<string>("");
  const [images, setImages] = React.useState<string[]>([]);

  const getImages = async () => {
    try {
      // fetch the images from the server by sending prompt in body using axios
      const response = await axios.post(
        "http://localhost:8080/api/image/extend",
        {
          prompt: promptValue,
        }
      );
      const images = response.data.image.data.map((item: any) => item.url);
      setImages(images);
    } catch {
      console.log("error");
    }
  };

  return (
    <Center className={classes.root}>
      <Stack align={"center"} spacing="xl">
        <Title>Extend Background</Title>
        <Textarea
          placeholder="Enter a prompt"
          required
          classNames={{ input: classes.textInput }}
          size="md"
          value={promptValue}
          onChange={(e) => setPromptValue(e.currentTarget.value)}
          onKeyDown={getHotkeyHandler([
            ["Enter", async () => await getImages()],
          ])}
        />
      </Stack>
      {/** Add a SimpleGrid for showing 4 images from the images array of  */}
      <SimpleGrid spacing={10} cols={2} py="lg">
        {images.map((image) => (
          <Image src={image} width={256} height={256} />
        ))}
      </SimpleGrid>
    </Center>
  );
}

export default App;

const useStyles = createStyles(() => ({
  root: {
    padding: 20,
    display: "flex",
    flexDirection: "column",
  },
  textInput: {
    // add a smooth shadow to the text input when in focus
    "&:focus": {
      boxShadow: "0 0 0 1px #eaeaea, 0 4px 11px rgba(0, 0, 0, 0.1)",
      border: "none",
      width: 650,
    },

    // transition the box-shadow and border properties
    transition: "box-shadow 0.5s ease, border 0.5s ease, width 0.3s ease",
    // transition the width from 300px to 650px when the text input is in focus
    width: 600,
  },
}));
