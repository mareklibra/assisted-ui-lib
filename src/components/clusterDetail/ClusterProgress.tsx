import React from 'react';
import { Cluster, Host } from '../../api/types';
import { Progress, ProgressVariant, ProgressMeasureLocation } from '@patternfly/react-core';
import { CLUSTER_STATUS_LABELS, TIME_ZERO } from '../../config/constants';
import { getHostProgressStages, getHostProgressStageNumber } from '../hosts/utils';
import { getHumanizedDateTime, DetailList, DetailItem } from '../ui';

import './ClusterProgress.css';

const getProgressVariant = (status: Cluster['status']) => {
  switch (status) {
    case 'cancelled':
    case 'error':
      return ProgressVariant.danger;
    case 'installed':
      return ProgressVariant.success;
    default:
      return undefined;
  }
};

const getMeasureLocation = (status: Cluster['status']) =>
  status === 'installed' ? ProgressMeasureLocation.none : ProgressMeasureLocation.top;

const getProgressLabel = (cluster: Cluster, progressPercent: number): string => {
  const { status, statusInfo } = cluster;
  if (['preparing-for-installation'].includes(status)) {
    return statusInfo;
  }
  if (['error', 'cancelled'].includes(status)) {
    return `${progressPercent}%`;
  }
  return `${statusInfo}: ${progressPercent}%`;
};

const getProgressPercent = (hosts: Host[] = []) => {
  const accountedHosts = hosts.filter((host) => !['disabled'].includes(host.status));
  const totalSteps = accountedHosts.reduce(
    (steps, host) => steps + getHostProgressStages(host).length,
    0,
  );
  const completedSteps = accountedHosts.reduce(
    (steps, host) => steps + getHostProgressStageNumber(host),
    0,
  );
  return (completedSteps / totalSteps) * 100;
};

const getInstallationStatus = (cluster: Cluster) => {
  const { status } = cluster;

  if (status === 'installed') {
    return `Installed on ${getHumanizedDateTime(cluster.installCompletedAt)}`;
  }
  if (status === 'error') {
    return `Failed on ${getHumanizedDateTime(cluster.installCompletedAt)}`;
  }
  if (status === 'cancelled') {
    return `Cancelled on ${getHumanizedDateTime(cluster.installCompletedAt)}`;
  }

  return CLUSTER_STATUS_LABELS[status] || status;
};

type ClusterProgressProps = {
  cluster: Cluster;
};

const ClusterProgress: React.FC<ClusterProgressProps> = ({ cluster }) => {
  const { status, hosts } = cluster;
  const progressPercent = React.useMemo(() => Math.round(getProgressPercent(hosts)), [hosts]);
  const label = getProgressLabel(cluster, progressPercent);

  return (
    <>
      <DetailList>
        {cluster.deletedAt && cluster.deletedAt !== TIME_ZERO ? (
          <DetailItem
            title="This cluster has been deleted on"
            value={getHumanizedDateTime(cluster.deletedAt)}
            idPrefix="cluster-progress-deleted-on"
          />
        ) : undefined}
        <DetailItem
          title="Started on"
          value={getHumanizedDateTime(cluster.installStartedAt)}
          idPrefix="cluster-progress-started-on"
        />
        <DetailItem
          title="Status"
          value={getInstallationStatus(cluster)}
          idPrefix="cluster-progress-status"
        />
      </DetailList>
      <Progress
        value={progressPercent}
        label={label}
        title=" "
        measureLocation={getMeasureLocation(status)}
        variant={getProgressVariant(status)}
        className="cluster-progress-bar"
      />
    </>
  );
};

export default ClusterProgress;
