import { Button, HStack, Text, VStack } from "@chakra-ui/react"

export const Question = ({title, selections, backOnClick, nextOnClick}: {
  title: string;
  selections: {key: string, onClick: () => void, active: boolean}[];
  nextOnClick: () => void;
  backOnClick: () => void;
}) => {
  return (
    <>
      <VStack>
        <Text>{title}</Text>
        <VStack>
          {selections.map((s, i) => (
            <Button
              onClick={s.onClick}
              background={s.active ? "black" : "white"}
              color={s.active ? "white" : "black"}
              key={i}
              marginBottom={3}
            >
              {s.key}
            </Button>
          ))}
        </VStack>
        <HStack>
          <Button
            onClick={backOnClick}
          >
            Back
          </Button>
          <Button
            onClick={nextOnClick}
          >
            Next
          </Button>
        </HStack>
      </VStack>
    </>
  )
}
