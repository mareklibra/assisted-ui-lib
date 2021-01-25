import React from 'react';
import { useDispatch } from 'react-redux';
import { Formik, FormikProps, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import _ from 'lodash';
import {
  Cluster,
  ClusterUpdateParams,
  getErrorMessage,
  handleApiError,
  ManagedDomain,
  patchCluster,
} from '../../api';
import { Form, Grid, GridItem, Text, TextContent } from '@patternfly/react-core';

import { trimSshPublicKey } from '../ui/formik/utils';
import { AlertsContext } from '../AlertsContextProvider';
import Alerts from '../ui/Alerts';
import {
  sshPublicKeyValidationSchema,
  ipBlockValidationSchema,
  dnsNameValidationSchema,
  hostPrefixValidationSchema,
  vipValidationSchema,
  ntpSourceValidationSchema,
} from '../ui/formik/validationSchemas';
import ClusterWizardStep from '../clusterWizard/ClusterWizardStep';
import { HostSubnets, NetworkConfigurationValues } from '../../types/clusters';
import { updateCluster } from '../../features/clusters/currentClusterSlice';
import ClusterWizardToolbar from '../clusterWizard/ClusterWizardToolbar';
import {
  canNextNetwork,
  canNextNetworkBackend,
  ClusterWizardStepsType,
} from '../clusterWizard/wizardTransition';
import ClusterWizardContext from '../clusterWizard/ClusterWizardContext';

import NetworkConfiguration from './NetworkConfiguration';
import ClusterSshKeyField from './ClusterSshKeyField';
import { getHostSubnets, getNetworkInitialValues } from './utils';

const validationSchema = (initialValues: NetworkConfigurationValues, hostSubnets: HostSubnets) =>
  Yup.lazy<NetworkConfigurationValues>((values) =>
    Yup.object<NetworkConfigurationValues>().shape({
      baseDnsDomain: dnsNameValidationSchema(initialValues.baseDnsDomain),
      clusterNetworkHostPrefix: hostPrefixValidationSchema(values),
      clusterNetworkCidr: ipBlockValidationSchema,
      serviceNetworkCidr: ipBlockValidationSchema,
      apiVip: vipValidationSchema(hostSubnets, values, initialValues.apiVip),
      ingressVip: vipValidationSchema(hostSubnets, values, initialValues.ingressVip),
      sshPublicKey: sshPublicKeyValidationSchema,
      additionalNtpSource: ntpSourceValidationSchema,
    }),
  );

const NetworkConfigurationForm: React.FC<{
  cluster: Cluster;
  managedDomains: ManagedDomain[];
}> = ({ cluster, managedDomains }) => {
  /* TODO(mlibra): Refactor alerts section along the butons
    const [isValidationSectionOpen, setIsValidationSectionOpen] = React.useState(false);
  const [isStartingInstallation, setIsStartingInstallation] = React.useState(false);
  */
  const { alerts, addAlert, clearAlerts } = React.useContext(AlertsContext);
  const { setCurrentStepId } = React.useContext(ClusterWizardContext);
  const dispatch = useDispatch();
  const hostSubnets = React.useMemo(() => getHostSubnets(cluster), [cluster]);
  const initialValues = React.useMemo(() => getNetworkInitialValues(cluster, managedDomains), [
    cluster,
    managedDomains,
  ]);

  const memoizedValidationSchema = React.useMemo(
    () => validationSchema(initialValues, hostSubnets),
    [hostSubnets, initialValues],
  );

  const handleSubmit = async (
    values: NetworkConfigurationValues,
    formikActions: FormikHelpers<NetworkConfigurationValues>,
  ) => {
    clearAlerts();

    // update the cluster configuration
    try {
      const params = _.omit(values, ['hostSubnet', 'useRedHatDnsService', 'shareDiscoverySshKey']);

      // Discard additionalNtpSource if it is empty
      if (!values.additionalNtpSource) {
        delete params.additionalNtpSource;
      }

      if (values.shareDiscoverySshKey) {
        params.sshPublicKey = cluster.imageInfo.sshPublicKey;
      }

      if (values.vipDhcpAllocation) {
        delete params.apiVip;
        delete params.ingressVip;
        const cidr = hostSubnets.find((hn) => hn.humanized === values.hostSubnet)?.subnet;
        params.machineNetworkCidr = cidr;
      }

      const { data } = await patchCluster(cluster.id, params);
      formikActions.resetForm({
        values: getNetworkInitialValues(data, managedDomains),
      });
      dispatch(updateCluster(data));

      canNextNetworkBackend({ cluster }) &&
        setCurrentStepId('TODO-NOT-YET-EXISTING-NEXT-STEP' as ClusterWizardStepsType);
    } catch (e) {
      handleApiError<ClusterUpdateParams>(e, () =>
        addAlert({ title: 'Failed to update the cluster', message: getErrorMessage(e) }),
      );
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={memoizedValidationSchema}
      onSubmit={handleSubmit}
      initialTouched={_.mapValues(initialValues, () => true)}
      validateOnMount
    >
      {({
        isSubmitting,
        isValid,
        dirty,
        values,
        errors,
        submitForm,
        setFieldValue,
      }: FormikProps<NetworkConfigurationValues>) => {
        const onClusterSshKeyToggle = (isChecked: boolean) =>
          setFieldValue('shareDiscoverySshKey', isChecked);
        const onClusterSshKeyVisibilityChanged = () => {
          onClusterSshKeyToggle(
            !!cluster.imageInfo.sshPublicKey &&
              (cluster.sshPublicKey === cluster.imageInfo.sshPublicKey || !cluster.sshPublicKey),
          );
        };
        const onSshKeyBlur = () => {
          if (values.sshPublicKey) {
            setFieldValue('sshPublicKey', trimSshPublicKey(values.sshPublicKey));
          }
        };

        const form = (
          <Grid hasGutter>
            <Form>
              <GridItem span={12} lg={10} xl={9} xl2={7}>
                <NetworkConfiguration
                  cluster={cluster}
                  hostSubnets={hostSubnets}
                  managedDomains={managedDomains}
                />
              </GridItem>
              <GridItem span={12} lg={10} xl={9} xl2={7}>
                <TextContent>
                  <Text component="h2">Security</Text>
                </TextContent>
                <ClusterSshKeyField
                  isSwitchHidden={!cluster.imageInfo.sshPublicKey}
                  name="shareDiscoverySshKey"
                  onToggle={onClusterSshKeyToggle}
                  onClusterSshKeyVisibilityChanged={onClusterSshKeyVisibilityChanged}
                  onSshKeyBlur={onSshKeyBlur}
                />
              </GridItem>
            </Form>
          </Grid>
        );

        const footer = (
          <Grid hasGutter>
            {!!alerts.length && (
              <GridItem span={12} lg={10} xl={9} xl2={7}>
                <Alerts />
              </GridItem>
            )}
            <GridItem span={12} lg={10} xl={9} xl2={7}>
              <ClusterWizardToolbar
                cluster={cluster}
                errors={errors}
                dirty={dirty}
                isSubmitting={isSubmitting}
                isNextDisabled={!canNextNetwork({ isValid, isSubmitting, cluster })}
                onNext={submitForm}
                onBack={() => setCurrentStepId('cluster-configuration')}
              />
            </GridItem>
          </Grid>
        );
        return <ClusterWizardStep footer={footer}>{form}</ClusterWizardStep>;
      }}
    </Formik>
  );
};

export default NetworkConfigurationForm;