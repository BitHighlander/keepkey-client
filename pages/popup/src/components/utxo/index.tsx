import {
  Avatar,
  Button,
  Card,
  CardHeader,
  Flex,
  Spinner,
  Stack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Divider,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
// import RequestFeeCard from './RequestFeeCard';
import RequestDataCard from './RequestDataCard';
// import RequestDetailsCard from './RequestDetailsCard';
// import ContractDetailsCard from './ContractDetailsCard';
import RequestMethodCard from './RequestMethodCard';
import ProjectInfoCard from './ProjectInfoCard';

export function EvmTransaction({ transaction, reloadEvents, handleResponse }: any) {
  return (
    <Stack>
      <ProjectInfoCard transaction={transaction} />

      <Divider />
      <RequestMethodCard transaction={transaction} />
      <Divider />
      <Tabs>
        <TabList>
          <Tab>Base</Tab>
          <Tab>utxos</Tab>
          <Tab>Fees</Tab>
          <Tab>Raw</Tab>
        </TabList>

        <TabPanels>
          {/* Contract Tab */}
          <TabPanel></TabPanel>

          {/* Review Tab */}
          <TabPanel></TabPanel>

          {/* Fees Tab */}
          <TabPanel></TabPanel>

          {/* Raw Data Tab */}
          <TabPanel>
            <RequestDataCard transaction={transaction} />
          </TabPanel>
        </TabPanels>
      </Tabs>

      <Divider />

      <Flex>
        <Button colorScheme="green" onClick={() => handleResponse('accept')} mr={2}>
          Approve
        </Button>
        <Button colorScheme="red" onClick={() => handleResponse('reject')}>
          Reject
        </Button>
      </Flex>
    </Stack>
  );
}

export default EvmTransaction;
