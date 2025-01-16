import React from "react";
import { Box, Text } from "@chakra-ui/react";

interface ThemeChapterStateProps {
  stage: string;
}

const ThemeChapterState: React.FC<ThemeChapterStateProps> = ({ stage }) => {
  return (
    <Box
      backgroundColor="#f0f8ff"
      padding="8px"
      borderRadius="8px"
      textAlign="center"
      fontWeight="bold"
      marginBottom="12px"
      width="300px"

    >
      <Text fontSize="lg">{stage}</Text>
    </Box>
  );
};

export default ThemeChapterState;
