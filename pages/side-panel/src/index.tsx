import { createRoot } from 'react-dom/client';
import { useEffect } from 'react';
import '@src/index.css';
import { ChakraProvider, useColorMode } from '@chakra-ui/react';
import { theme } from '@src/styles/theme';
import SidePanel from '@src/SidePanel';

const ForceDarkMode = ({ children }: { children: React.ReactNode }) => {
  const { setColorMode } = useColorMode();

  useEffect(() => {
    setColorMode('dark');
  }, [setColorMode]);

  return <>{children}</>;
};

function init() {
  const appContainer = document.querySelector('#app-container');
  if (!appContainer) {
    throw new Error('Can not find #app-container');
  }
  const root = createRoot(appContainer);
  root.render(
    <ChakraProvider theme={theme}>
      <ForceDarkMode>
        <SidePanel />
      </ForceDarkMode>
    </ChakraProvider>,
  );
}

init();
