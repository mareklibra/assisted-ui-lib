import React from 'react';
import { useDispatch } from 'react-redux';
import { Grid, GridItem, Stack, StackItem, Text, TextContent } from '@patternfly/react-core';
import { Cluster } from '../../api/types';
import ClusterWizardStep from '../clusterWizard/ClusterWizardStep';
import { AlertsContext } from '../AlertsContextProvider';
import ClusterWizardContext from '../clusterWizard/ClusterWizardContext';
import Alerts from '../ui/Alerts';
import ClusterWizardToolbar from '../clusterWizard/ClusterWizardToolbar';
import { getErrorMessage, handleApiError, postInstallCluster } from '../../api';
import { updateCluster } from '../../features/clusters/currentClusterSlice';
import ReviewCluster from './ReviewCluster';

const ReviewStep: React.FC<{ cluster: Cluster }> = ({ cluster }) => {
  const { alerts, addAlert } = React.useContext(AlertsContext);
  const { setCurrentStepId } = React.useContext(ClusterWizardContext);
  const dispatch = useDispatch();

  const onInstall = async () => {
    try {
      const { data } = await postInstallCluster(cluster.id);
      dispatch(updateCluster(data));
      // If successful, backend changes cluster state which leads to unmounting the Wizard
      // If validation fails, the wizard stays on this step and shows alerts
    } catch (e) {
      handleApiError(e, () =>
        addAlert({
          title: 'Failed to start cluster installation',
          message: getErrorMessage(e),
        }),
      );
    }
  };

  const footer = (
    <Stack hasGutter>
      {!!alerts.length && (
        <StackItem>
          <Alerts />
        </StackItem>
      )}
      <StackItem>
        <ClusterWizardToolbar
          cluster={cluster}
          onBack={() => setCurrentStepId('networking')}
          onInstall={onInstall}
        />
      </StackItem>
    </Stack>
  );

  return (
    <ClusterWizardStep footer={footer}>
      <Grid hasGutter>
        <GridItem span={12}>
          <TextContent>
            <Text component="h2">Review and create</Text>
          </TextContent>
        </GridItem>
        <GridItem span={12} lg={10} xl={9} xl2={7}>
          <ReviewCluster cluster={cluster} />
        </GridItem>

        {/* TODO(mlibra): Implement in context of the initial configuration selection
        <GridItem span={12} lg={10} xl={9} xl2={7}>
          <TextContent>
            <Text component="h2">Capability level</Text>
          </TextContent>
        </GridItem>
        */}

        {/* TODO(mlibra): Show YAML manifests
         <GridItem span={12} lg={10} xl={9} xl2={7}>
         <ExpandableSection>
         </ExpandableSection>
         </GridItem>
        */}
      </Grid>
    </ClusterWizardStep>
  );
};

export default ReviewStep;