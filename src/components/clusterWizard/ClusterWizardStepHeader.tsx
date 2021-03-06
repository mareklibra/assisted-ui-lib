import React from 'react';
import { Split, SplitItem, Text, TextContent, ButtonVariant } from '@patternfly/react-core';
import { EventsModalButton } from '../ui/eventsModal';
import { Cluster } from '../../api/types';

const ClusterWizardStepHeader: React.FC<{ cluster?: Cluster }> = ({ cluster, children }) => {
  return (
    <Split>
      <SplitItem>
        <TextContent>
          <Text component="h2">{children}</Text>
        </TextContent>
      </SplitItem>
      <SplitItem isFilled />
      {cluster && (
        <SplitItem>
          <EventsModalButton
            id="cluster-events-button"
            entityKind="cluster"
            cluster={cluster}
            title="Cluster Events"
            variant={ButtonVariant.secondary}
          >
            View Cluster Events
          </EventsModalButton>
        </SplitItem>
      )}
    </Split>
  );
};

export default ClusterWizardStepHeader;
