import React from 'react';
import { Host } from '../../api/types';
import { ValidationsInfo } from '../../types/hosts';
import HostStatus from './HostStatus';
import {
  getFailingClusterWizardSoftValidationIds,
  getWizardStepHostStatus,
  getWizardStepHostValidationsInfo,
} from '../clusterWizard/wizardTransition';

type HardwareStatusProps = {
  host: Host;
  validationsInfo: ValidationsInfo;
  onEditHostname?: () => void;
};

const HardwareStatus: React.FC<HardwareStatusProps> = (props) => {
  const hardwareStatus = getWizardStepHostStatus(props.host, 'host-discovery');
  const validationsInfo = getWizardStepHostValidationsInfo(props.validationsInfo, 'host-discovery');
  const sublabel = getFailingClusterWizardSoftValidationIds(validationsInfo, 'host-discovery')
    .length
    ? 'Some validations failed'
    : undefined;

  return (
    <HostStatus
      {...props}
      statusOverride={hardwareStatus}
      validationsInfo={validationsInfo}
      sublabel={sublabel}
    />
  );
};

export default HardwareStatus;
