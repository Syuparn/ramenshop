import './App.css'
import { ramenMachine } from './state/machine';
import { useMachine } from '@xstate/react';
import { Questions } from './Questions';
import { Text } from '@chakra-ui/react';

function App() {
  const [state, send] = useMachine(ramenMachine);

  return (
    <>
      <Text
        marginBottom={4}
      >
        <b>ラーメン食券🍜</b>
      </Text>
      <Questions
        state={state}
        send={send}
      />
    </>
  );
}

export default App
