import * as React from 'react';
import { Formik, useFormikContext } from 'formik';
import { Wizard, WizardStep, WizardStepFunctionType } from '@patternfly/react-core';
import { AlertsContextProvider, useAlerts } from '../AlertsContextProvider';
import {
  getClusterDetailsInitialValues,
  getClusterDetailsValidationSchema,
} from '../clusterWizard/utils';
import { Cluster } from '../../api';
import { OpenshiftVersionOptionType } from '../../types/versions';
import {
  ClusterDeploymentDetailsProps,
  ClusterDeploymentWizardProps,
  ClusterDeploymentWizardValues,
} from './types';
import ClusterDeploymentDetails from './ClusterDeploymentDetails';

const getInitialValues = ({
  cluster,
  ocpVersions,
  defaultPullSecret,
}: {
  cluster?: Cluster;
  ocpVersions: OpenshiftVersionOptionType[];
  defaultPullSecret?: string;
}): ClusterDeploymentWizardValues => {
  // TODO(mlibra): update for other steps
  return getClusterDetailsInitialValues({
    cluster,
    pullSecret: defaultPullSecret,
    managedDomains: [], // not supported
    ocpVersions,
  });
};

const getValidationSchema = (usedClusterNames: string[]) => {
  // TODO(mlibra): update for other steps
  return getClusterDetailsValidationSchema(usedClusterNames);
};

const ClusterDeploymentWizardInternal: React.FC<
  ClusterDeploymentDetailsProps & { className?: string; onClose: () => void }
> = ({ className, ocpVersions, defaultPullSecret, cluster, onClose }) => {
  const { isValid, isValidating, isSubmitting, submitForm } = useFormikContext<
    ClusterDeploymentWizardValues
  >();

  const onSave = () => {
    // at the transition from the last step
    submitForm();
  };

  const onNext: WizardStepFunctionType = () => {
    submitForm(); // TODO(mlibra): Let's see if we can do it like this
  };

  const onBack: WizardStepFunctionType = () => {
    // probably nothing to do here
    // No submitForm() here. Just dismiss changes.
  };

  const canNextClusterDetails = () => {
    // consider functions from wizardTransitions.ts
    return isValid && !isValidating && !isSubmitting;
  };

  const steps: WizardStep[] = [
    {
      id: 'cluster-details',
      name: 'Cluster details',
      component: (
        <ClusterDeploymentDetails
          defaultPullSecret={defaultPullSecret}
          ocpVersions={ocpVersions}
          cluster={cluster}
        />
      ),
      enableNext: canNextClusterDetails(),
    },
    {
      id: 'todo-next-wizard-step-id',
      name: 'Next step details',
      component: <div>FOO BAR</div>,
      enableNext: true,
    },
  ];

  return (
    <Wizard
      className={className}
      navAriaLabel="New cluster deployment steps"
      mainAriaLabel="New cluster deployment content"
      steps={steps}
      onClose={onClose}
      onNext={onNext}
      onBack={onBack}
      onSave={onSave}
    />
  );
};

const ClusterDeploymentWizard: React.FC<ClusterDeploymentWizardProps> = ({
  className,
  cluster,
  onClusterSave,
  onClose,
  ocpVersions,
  defaultPullSecret,
  usedClusterNames,
}) => {
  const { addAlert, clearAlerts } = useAlerts();

  const handleSubmit = async (values: ClusterDeploymentWizardValues) => {
    clearAlerts();

    // const params: ClusterCreateParams = _.omit(values, ['useRedHatDnsService', 'SNODisclaimer']);
    try {
      await onClusterSave(values);
      onClose();
    } catch (e) {
      addAlert({ title: 'Failed to save ClusterDeployment', message: e });
    }
  };

  const initialValues = React.useMemo(
    () => getInitialValues({ cluster, ocpVersions, defaultPullSecret }),
    [cluster, ocpVersions, defaultPullSecret],
  );
  const validationSchema = React.useMemo(() => getValidationSchema(usedClusterNames), [
    usedClusterNames,
  ]);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      validateOnMount={true}
    >
      {() => (
        <ClusterDeploymentWizardInternal
          className={className}
          defaultPullSecret={defaultPullSecret}
          ocpVersions={ocpVersions}
          onClose={onClose}
        />
      )}
    </Formik>
  );
};

const ClusterDeploymentWizardWithContext: React.FC<ClusterDeploymentWizardProps> = (
  props: ClusterDeploymentWizardProps,
) => (
  <AlertsContextProvider>
    <ClusterDeploymentWizard {...props} />
  </AlertsContextProvider>
);

export default ClusterDeploymentWizardWithContext;