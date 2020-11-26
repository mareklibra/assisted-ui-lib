export interface AddHostsClusterCreateParams {
  /**
   * Unique identifier of the object.
   */
  id: string; // uuid
  /**
   * Name of the OpenShift cluster.
   */
  name: string;
  /**
   * api vip domain.
   */
  apiVipDnsname: string;
  /**
   * Version of the OpenShift cluster.
   */
  openshiftVersion: '4.6';
}
export interface ApiVipConnectivityRequest {
  /**
   * URL address of the API.
   */
  url: string;
  /**
   * Whether to verify if the API VIP belongs to one of the interfaces.
   */
  verifyCidr?: boolean;
}
export interface ApiVipConnectivityResponse {
  /**
   * API VIP connecitivty check result.
   */
  isSuccess?: boolean;
}
export interface AssistedServiceIsoCreateParams {
  /**
   * SSH public key for debugging the installation.
   */
  sshPublicKey?: string;
  /**
   * The pull secret obtained from Red Hat OpenShift Cluster Manager at cloud.redhat.com/openshift/install/pull-secret.
   */
  pullSecret?: string;
}
export interface Boot {
  currentBootMode?: string;
  pxeInterface?: string;
}
export interface Cluster {
  /**
   * Indicates the type of this object. Will be 'Cluster' if this is a complete object or 'ClusterLink' if it is just a link,
   * 'AddHostCluster' for cluster that add hosts to existing OCP cluster,
   * 'AddHostsOCPCluster' for cluster running on the OCP and add hosts to it
   *
   */
  kind: 'Cluster' | 'AddHostsCluster' | 'AddHostsOCPCluster';
  /**
   * Unique identifier of the object.
   */
  id: string; // uuid
  /**
   * Self link.
   */
  href: string;
  /**
   * Name of the OpenShift cluster.
   */
  name?: string;
  userName?: string;
  orgId?: string;
  emailDomain?: string;
  /**
   * Version of the OpenShift cluster.
   */
  openshiftVersion?: '4.5' | '4.6';
  /**
   * Cluster ID on OCP system.
   */
  openshiftClusterId?: string; // uuid
  imageInfo: ImageInfo;
  /**
   * Base domain of the cluster. All DNS records must be sub-domains of this base and include the cluster name.
   */
  baseDnsDomain?: string;
  /**
   * IP address block from which Pod IPs are allocated. This block must not overlap with existing physical networks. These IP addresses are used for the Pod network, and if you need to access the Pods from an external network, configure load balancers and routers to manage the traffic.
   */
  clusterNetworkCidr?: string; // ^([0-9]{1,3}\.){3}[0-9]{1,3}\/[0-9]|[1-2][0-9]|3[0-2]?$
  /**
   * The subnet prefix length to assign to each individual node. For example, if clusterNetworkHostPrefix is set to 23, then each node is assigned a /23 subnet out of the given cidr (clusterNetworkCIDR), which allows for 510 (2^(32 - 23) - 2) pod IPs addresses. If you are required to provide access to nodes from an external network, configure load balancers and routers to manage the traffic.
   */
  clusterNetworkHostPrefix?: number;
  /**
   * The IP address pool to use for service IP addresses. You can enter only one IP address pool. If you need to access the services from an external network, configure load balancers and routers to manage the traffic.
   */
  serviceNetworkCidr?: string; // ^([0-9]{1,3}\.){3}[0-9]{1,3}\/[0-9]|[1-2][0-9]|3[0-2]?$
  /**
   * The virtual IP used to reach the OpenShift cluster's API.
   */
  apiVip?: string; // ^(([0-9]{1,3}\.){3}[0-9]{1,3})?$
  /**
   * The domain name used to reach the OpenShift cluster API.
   */
  apiVipDnsName?: string;
  /**
   * A CIDR that all hosts belonging to the cluster should have an interfaces with IP address that belongs to this CIDR. The apiVip belongs to this CIDR.
   */
  machineNetworkCidr?: string; // ^([0-9]{1,3}\.){3}[0-9]{1,3}\/[0-9]|[1-2][0-9]|3[0-2]?$
  /**
   * The virtual IP used for cluster ingress traffic.
   */
  ingressVip?: string; // ^(([0-9]{1,3}\.){3}[0-9]{1,3})?$
  /**
   * SSH public key for debugging OpenShift nodes.
   */
  sshPublicKey?: string;
  /**
   * A proxy URL to use for creating HTTP connections outside the cluster.
   * http://\<username\>:\<pswd\>@\<ip\>:\<port\>
   *
   */
  httpProxy?: string;
  /**
   * A proxy URL to use for creating HTTPS connections outside the cluster.
   * http://\<username\>:\<pswd\>@\<ip\>:\<port\>
   *
   */
  httpsProxy?: string;
  /**
   * A comma-separated list of destination domain names, domains, IP addresses, or other network CIDRs to exclude from proxying.
   */
  noProxy?: string;
  /**
   * Status of the OpenShift cluster.
   */
  status:
    | 'insufficient'
    | 'ready'
    | 'error'
    | 'preparing-for-installation'
    | 'pending-for-input'
    | 'installing'
    | 'finalizing'
    | 'installed'
    | 'adding-hosts'
    | 'cancelled'
    | 'installing-pending-user-action';
  /**
   * Additional information pertaining to the status of the OpenShift cluster.
   */
  statusInfo: string;
  /**
   * The last time that the cluster status was updated.
   */
  statusUpdatedAt?: string; // date-time
  /**
   * Hosts that are associated with this cluster.
   */
  hosts?: Host[];
  /**
   * The last time that this cluster was updated.
   */
  updatedAt?: string; // date-time
  /**
   * The time that this cluster was created.
   */
  createdAt?: string; // date-time
  /**
   * The time that this cluster started installation.
   */
  installStartedAt?: string; // date-time
  /**
   * The time that this cluster completed installation.
   */
  installCompletedAt?: string; // date-time
  /**
   * List of host networks to be filled during query.
   */
  hostNetworks?: HostNetwork[];
  /**
   * True if the pull secret has been added to the cluster.
   */
  pullSecretSet?: boolean;
  ignitionGeneratorVersion?: string;
  /**
   * Indicate if virtual IP DHCP allocation mode is enabled.
   */
  vipDhcpAllocation?: boolean;
  /**
   * JSON-formatted string containing the validation results for each validation id grouped by category (network, hosts-data, etc.)
   */
  validationsInfo?: string;
  /**
   * JSON-formatted string containing the user overrides for the install-config.yaml file.
   * example:
   * {"networking":{"networkType": "OVN-Kubernetes"},"fips":true}
   */
  installConfigOverrides?: string;
  /**
   * Json formatted string containing the user overrides for the initial ignition config
   * example:
   * {"ignition": {"version": "3.1.0"}, "storage": {"files": [{"path": "/tmp/example", "contents": {"source": "data:text/plain;base64,aGVscGltdHJhcHBlZGluYXN3YWdnZXJzcGVj"}}]}}
   */
  ignitionConfigOverrides?: string;
  controllerLogsCollectedAt?: string; // date-time
  /**
   * Json formatted string containing the majority groups for conectivity checks.
   */
  connectivityMajorityGroups?: string;
  /**
   * The time that the cluster was deleted.
   */
  deletedAt?: string; // date-time
  /**
   * Indicate if the networking is managed by the user.
   */
  'user-managed-networking'?: boolean;
  /**
   * NTP source going to be added to all the hosts.
   */
  additionalNtpSource?: string;
}
export interface ClusterCreateParams {
  /**
   * Name of the OpenShift cluster.
   */
  name: string;
  /**
   * Version of the OpenShift cluster.
   */
  openshiftVersion: '4.5' | '4.6';
  /**
   * Base domain of the cluster. All DNS records must be sub-domains of this base and include the cluster name.
   */
  baseDnsDomain?: string;
  /**
   * IP address block from which Pod IPs are allocated. This block must not overlap with existing physical networks. These IP addresses are used for the Pod network, and if you need to access the Pods from an external network, configure load balancers and routers to manage the traffic.
   */
  clusterNetworkCidr?: string; // ^([0-9]{1,3}\.){3}[0-9]{1,3}\/[0-9]|[1-2][0-9]|3[0-2]?$
  /**
   * The subnet prefix length to assign to each individual node. For example, if clusterNetworkHostPrefix is set to 23, then each node is assigned a /23 subnet out of the given cidr (clusterNetworkCIDR), which allows for 510 (2^(32 - 23) - 2) pod IPs addresses. If you are required to provide access to nodes from an external network, configure load balancers and routers to manage the traffic.
   */
  clusterNetworkHostPrefix?: number;
  /**
   * The IP address pool to use for service IP addresses. You can enter only one IP address pool. If you need to access the services from an external network, configure load balancers and routers to manage the traffic.
   */
  serviceNetworkCidr?: string; // ^([0-9]{1,3}\.){3}[0-9]{1,3}\/[0-9]|[1-2][0-9]|3[0-2]?$
  /**
   * The virtual IP used for cluster ingress traffic.
   */
  ingressVip?: string; // ^(([0-9]{1,3}\.){3}[0-9]{1,3})?$
  /**
   * The pull secret obtained from Red Hat OpenShift Cluster Manager at cloud.redhat.com/openshift/install/pull-secret.
   */
  pullSecret: string;
  /**
   * SSH public key for debugging OpenShift nodes.
   */
  sshPublicKey?: string;
  /**
   * Indicate if virtual IP DHCP allocation mode is enabled.
   */
  vipDhcpAllocation?: boolean;
  /**
   * A proxy URL to use for creating HTTP connections outside the cluster.
   * http://\<username\>:\<pswd\>@\<ip\>:\<port\>
   *
   */
  httpProxy?: string;
  /**
   * A proxy URL to use for creating HTTPS connections outside the cluster.
   * http://\<username\>:\<pswd\>@\<ip\>:\<port\>
   *
   */
  httpsProxy?: string;
  /**
   * An "*" or a comma-separated list of destination domain names, domains, IP addresses, or other network CIDRs to exclude from proxying.
   */
  noProxy?: string;
  /**
   * Indicate if the networking is managed by the user.
   */
  'user-managed-networking'?: boolean;
  /**
   * NTP source going to be added to all the hosts.
   */
  additionalNtpSource?: string;
}
export type ClusterList = Cluster[];
export interface ClusterUpdateParams {
  /**
   * OpenShift cluster name.
   */
  name?: string;
  /**
   * Base domain of the cluster. All DNS records must be sub-domains of this base and include the cluster name.
   */
  baseDnsDomain?: string;
  /**
   * IP address block from which Pod IPs are allocated. This block must not overlap with existing physical networks. These IP addresses are used for the Pod network, and if you need to access the Pods from an external network, configure load balancers and routers to manage the traffic.
   */
  clusterNetworkCidr?: string; // ^([0-9]{1,3}\.){3}[0-9]{1,3}\/[0-9]|[1-2][0-9]|3[0-2]?$
  /**
   * The subnet prefix length to assign to each individual node. For example, if clusterNetworkHostPrefix is set to 23, then each node is assigned a /23 subnet out of the given cidr (clusterNetworkCIDR), which allows for 510 (2^(32 - 23) - 2) pod IPs addresses. If you are required to provide access to nodes from an external network, configure load balancers and routers to manage the traffic.
   */
  clusterNetworkHostPrefix?: number;
  /**
   * The IP address pool to use for service IP addresses. You can enter only one IP address pool. If you need to access the services from an external network, configure load balancers and routers to manage the traffic.
   */
  serviceNetworkCidr?: string; // ^([0-9]{1,3}\.){3}[0-9]{1,3}\/[0-9]|[1-2][0-9]|3[0-2]?$
  /**
   * The virtual IP used to reach the OpenShift cluster's API.
   */
  apiVip?: string; // ^(([0-9]{1,3}\.){3}[0-9]{1,3})?$
  /**
   * The virtual IP used for cluster ingress traffic.
   */
  ingressVip?: string; // ^(([0-9]{1,3}\.){3}[0-9]{1,3})?$
  /**
   * The domain name used to reach the OpenShift cluster API.
   */
  apiVipDnsName?: string;
  /**
   * A CIDR that all hosts belonging to the cluster should have an interfaces with IP address that belongs to this CIDR. The apiVip belongs to this CIDR.
   */
  machineNetworkCidr?: string; // ^([0-9]{1,3}\.){3}[0-9]{1,3}\/[0-9]|[1-2][0-9]|3[0-2]?$
  /**
   * The pull secret obtained from Red Hat OpenShift Cluster Manager at cloud.redhat.com/openshift/install/pull-secret.
   */
  pullSecret?: string;
  /**
   * SSH public key for debugging OpenShift nodes.
   */
  sshPublicKey?: string;
  /**
   * Indicate if virtual IP DHCP allocation mode is enabled.
   */
  vipDhcpAllocation?: boolean;
  /**
   * A proxy URL to use for creating HTTP connections outside the cluster.
   * http://\<username\>:\<pswd\>@\<ip\>:\<port\>
   *
   */
  httpProxy?: string;
  /**
   * A proxy URL to use for creating HTTPS connections outside the cluster.
   * http://\<username\>:\<pswd\>@\<ip\>:\<port\>
   *
   */
  httpsProxy?: string;
  /**
   * An "*" or a comma-separated list of destination domain names, domains, IP addresses, or other network CIDRs to exclude from proxying.
   */
  noProxy?: string;
  /**
   * The desired role for hosts associated with the cluster.
   */
  hostsRoles?: {
    id?: string; // uuid
    role?: HostRoleUpdateParams;
  }[];
  /**
   * The desired hostname for hosts associated with the cluster.
   */
  hostsNames?: {
    id?: string; // uuid
    hostname?: string;
  }[];
  /**
   * Indicate if the networking is managed by the user.
   */
  'user-managed-networking'?: boolean;
  /**
   * NTP source going to be added to all the hosts.
   */
  additionalNtpSource?: string;
}
export type ClusterValidationId =
  | 'machine-cidr-defined'
  | 'cluster-cidr-defined'
  | 'service-cidr-defined'
  | 'no-cidrs-overlapping'
  | 'network-prefix-valid'
  | 'machine-cidr-equals-to-calculated-cidr'
  | 'api-vip-defined'
  | 'api-vip-valid'
  | 'ingress-vip-defined'
  | 'ingress-vip-valid'
  | 'all-hosts-are-ready-to-install'
  | 'sufficient-masters-count'
  | 'dns-domain-defined'
  | 'pull-secret-set'
  | 'ntp-server-configured';
export interface CompletionParams {
  isSuccess: boolean;
  errorInfo?: string;
}
export interface ConnectivityCheckHost {
  hostId?: string; // uuid
  nics?: ConnectivityCheckNic[];
}
export interface ConnectivityCheckNic {
  name?: string;
  mac?: string;
  ipAddresses?: string[];
}
export type ConnectivityCheckParams = ConnectivityCheckHost[];
export interface ConnectivityRemoteHost {
  hostId?: string; // uuid
  l2Connectivity?: L2Connectivity[];
  l3Connectivity?: L3Connectivity[];
}
export interface ConnectivityReport {
  remoteHosts?: ConnectivityRemoteHost[];
}
export interface Cpu {
  count?: number;
  frequency?: number;
  flags?: string[];
  modelName?: string;
  architecture?: string;
}
export interface CreateManifestParams {
  /**
   * The folder that contains the files. Manifests can be placed in 'manifests' or 'openshift' directories.
   */
  folder?: 'manifests' | 'openshift';
  /**
   * The name of the manifest to be stored on S3 and to be created on '{folder}/{fileName}' at ignition generation using openshift-install.
   */
  fileName: string;
  /**
   * base64 encoded manifest content.
   */
  content: string;
}
export interface Credentials {
  username?: string;
  password?: string;
  consoleUrl?: string;
}
export interface DhcpAllocationRequest {
  /**
   * The network interface (NIC) to run the DHCP requests on.
   */
  interface: string;
  /**
   * MAC address for the API virtual IP.
   */
  apiVipMac: string; // mac
  /**
   * MAC address for the Ingress virtual IP.
   */
  ingressVipMac: string; // mac
  /**
   * Contents of lease file to be used for API virtual IP.
   */
  apiVipLease?: string;
  /**
   * Contents of lease file to be used for for Ingress virtual IP.
   */
  ingressVipLease?: string;
}
export interface DhcpAllocationResponse {
  /**
   * The IPv4 address that was allocated by DHCP for the API virtual IP.
   */
  apiVipAddress: string; // ipv4
  /**
   * The IPv4 address that was allocated by DHCP for the Ingress virtual IP.
   */
  ingressVipAddress: string; // ipv4
  /**
   * Contents of last aquired lease for API virtual IP.
   */
  apiVipLease?: string;
  /**
   * Contents of last aquired lease for Ingress virtual IP.
   */
  ingressVipLease?: string;
}
export interface DiscoveryIgnitionParams {
  config?: string;
}
export interface Disk {
  driveType?: string;
  vendor?: string;
  name?: string;
  path?: string;
  hctl?: string;
  byPath?: string;
  model?: string;
  wwn?: string;
  serial?: string;
  sizeBytes?: number;
  bootable?: boolean;
  smart?: string;
}
export interface Error {
  /**
   * Indicates the type of this object. Will always be 'Error'.
   */
  kind: 'Error';
  /**
   * Numeric identifier of the error.
   */
  id: number; // int32
  /**
   * Self link.
   */
  href: string;
  /**
   * Globally unique code of the error, composed of the unique identifier of the API and the numeric identifier of the error. For example, if the numeric identifier of the error is 93 and the identifier of the API is assistedInstall then the code will be ASSISTED-INSTALL-93.
   */
  code: string;
  /**
   * Human-readable description of the error.
   */
  reason: string;
}
export interface Event {
  /**
   * Unique identifier of the cluster this event relates to.
   */
  clusterId: string; // uuid
  /**
   * Unique identifier of the host this event relates to.
   */
  hostId?: string; // uuid
  severity: 'info' | 'warning' | 'error' | 'critical';
  message: string;
  eventTime: string; // date-time
  /**
   * Unique identifier of the request that caused this event to occur.
   */
  requestId?: string; // uuid
}
export type EventList = Event[];
export type FreeAddressesList = string /* ipv4 */[];
export type FreeAddressesRequest = string /* ^([0-9]{1,3}\.){3}[0-9]{1,3}\/[0-9]|[1-2][0-9]|3[0-2]?$ */[];
export interface FreeNetworkAddresses {
  network?: string; // ^([0-9]{1,3}\.){3}[0-9]{1,3}\/[0-9]|[1-2][0-9]|3[0-2]?$
  freeAddresses?: string /* ipv4 */[];
}
export type FreeNetworksAddresses = FreeNetworkAddresses[];
export interface Host {
  /**
   * Indicates the type of this object. Will be 'Host' if this is a complete object or 'HostLink' if it is just a link, or
   * 'AddToExistingClusterHost' for host being added to existing OCP cluster, or
   * 'AddToExistingClusterOCPHost' for host being added to existing OCP cluster via OCP AI cluster
   *
   */
  kind: 'Host' | 'AddToExistingClusterHost' | 'AddToExistingClusterOCPHost';
  /**
   * Unique identifier of the object.
   */
  id: string; // uuid
  /**
   * Self link.
   */
  href: string;
  /**
   * The cluster that this host is associated with.
   */
  clusterId?: string; // uuid
  status:
    | 'discovering'
    | 'known'
    | 'disconnected'
    | 'insufficient'
    | 'disabled'
    | 'preparing-for-installation'
    | 'pending-for-input'
    | 'installing'
    | 'installing-in-progress'
    | 'installing-pending-user-action'
    | 'resetting-pending-user-action'
    | 'installed'
    | 'error'
    | 'resetting'
    | 'added-to-existing-cluster'
    | 'cancelled';
  statusInfo: string;
  /**
   * JSON-formatted string containing the validation results for each validation id grouped by category (network, hardware, etc.)
   */
  validationsInfo?: string;
  /**
   * The last time that the host status was updated.
   */
  statusUpdatedAt?: string; // date-time
  progress?: HostProgressInfo;
  /**
   * Time at which the current progress stage started.
   */
  stageStartedAt?: string; // date-time
  /**
   * Time at which the current progress stage was last updated.
   */
  stageUpdatedAt?: string; // date-time
  progressStages?: HostStage[];
  connectivity?: string;
  apiVipConnectivity?: string;
  inventory?: string;
  freeAddresses?: string;
  /**
   * The configured NTP sources on the host.
   */
  ntpSources?: string;
  role?: HostRole;
  bootstrap?: boolean;
  logsCollectedAt?: string; // datetime
  /**
   * Installer version.
   */
  installerVersion?: string;
  /**
   * Host installation path.
   */
  installationDiskPath?: string;
  updatedAt?: string; // date-time
  createdAt?: string; // date-time
  /**
   * The last time the host's agent communicated with the service.
   */
  checkedInAt?: string; // date-time
  discoveryAgentVersion?: string;
  requestedHostname?: string;
  userName?: string;
  /**
   * The time that the host was deleted.
   */
  deletedAt?: string; // date-time
  /**
   * Json formatted string containing the user overrides for the host's pointer ignition
   * example:
   * {"ignition": {"version": "3.1.0"}, "storage": {"files": [{"path": "/tmp/example", "contents": {"source": "data:text/plain;base64,aGVscGltdHJhcHBlZGluYXN3YWdnZXJzcGVj"}}]}}
   */
  ignitionConfigOverrides?: string;
  installerArgs?: string;
}
export interface HostCreateParams {
  hostId: string; // uuid
  discoveryAgentVersion?: string;
}
export interface HostIgnitionParams {
  config?: string;
}
export type HostList = Host[];
export interface HostNetwork {
  cidr?: string;
  hostIds?: string /* uuid */[];
}
export interface HostProgress {
  currentStage: HostStage;
  progressInfo?: string;
}
export interface HostProgressInfo {
  currentStage: HostStage;
  progressInfo?: string;
  /**
   * Time at which the current progress stage started.
   */
  stageStartedAt?: string; // date-time
  /**
   * Time at which the current progress stage was last updated.
   */
  stageUpdatedAt?: string; // date-time
}
export interface HostRegistrationResponse {
  /**
   * Indicates the type of this object. Will be 'Host' if this is a complete object or 'HostLink' if it is just a link, or
   * 'AddToExistingClusterHost' for host being added to existing OCP cluster, or
   * 'AddToExistingClusterOCPHost' for host being added to existing OCP cluster via OCP AI cluster
   *
   */
  kind: 'Host' | 'AddToExistingClusterHost' | 'AddToExistingClusterOCPHost';
  /**
   * Unique identifier of the object.
   */
  id: string; // uuid
  /**
   * Self link.
   */
  href: string;
  /**
   * The cluster that this host is associated with.
   */
  clusterId?: string; // uuid
  status:
    | 'discovering'
    | 'known'
    | 'disconnected'
    | 'insufficient'
    | 'disabled'
    | 'preparing-for-installation'
    | 'pending-for-input'
    | 'installing'
    | 'installing-in-progress'
    | 'installing-pending-user-action'
    | 'resetting-pending-user-action'
    | 'installed'
    | 'error'
    | 'resetting'
    | 'added-to-existing-cluster'
    | 'cancelled';
  statusInfo: string;
  /**
   * JSON-formatted string containing the validation results for each validation id grouped by category (network, hardware, etc.)
   */
  validationsInfo?: string;
  /**
   * The last time that the host status was updated.
   */
  statusUpdatedAt?: string; // date-time
  progress?: HostProgressInfo;
  /**
   * Time at which the current progress stage started.
   */
  stageStartedAt?: string; // date-time
  /**
   * Time at which the current progress stage was last updated.
   */
  stageUpdatedAt?: string; // date-time
  progressStages?: HostStage[];
  connectivity?: string;
  apiVipConnectivity?: string;
  inventory?: string;
  freeAddresses?: string;
  /**
   * The configured NTP sources on the host.
   */
  ntpSources?: string;
  role?: HostRole;
  bootstrap?: boolean;
  logsCollectedAt?: string; // datetime
  /**
   * Installer version.
   */
  installerVersion?: string;
  /**
   * Host installation path.
   */
  installationDiskPath?: string;
  updatedAt?: string; // date-time
  createdAt?: string; // date-time
  /**
   * The last time the host's agent communicated with the service.
   */
  checkedInAt?: string; // date-time
  discoveryAgentVersion?: string;
  requestedHostname?: string;
  userName?: string;
  /**
   * The time that the host was deleted.
   */
  deletedAt?: string; // date-time
  /**
   * Json formatted string containing the user overrides for the host's pointer ignition
   * example:
   * {"ignition": {"version": "3.1.0"}, "storage": {"files": [{"path": "/tmp/example", "contents": {"source": "data:text/plain;base64,aGVscGltdHJhcHBlZGluYXN3YWdnZXJzcGVj"}}]}}
   */
  ignitionConfigOverrides?: string;
  installerArgs?: string;
  /**
   * Command for starting the next step runner
   */
  nextStepRunnerCommand?: {
    command?: string;
    args?: string[];
    /**
     * How long in seconds to wait before retrying registration if the command fails
     */
    retrySeconds?: number;
  };
}
export interface HostRequirements {
  master?: HostRequirementsRole;
  worker?: HostRequirementsRole;
}
export interface HostRequirementsRole {
  cpuCores?: number;
  ramGib?: number;
  diskSizeGb?: number;
}
export type HostRole = 'auto-assign' | 'master' | 'worker' | 'bootstrap';
export type HostRoleUpdateParams = 'auto-assign' | 'master' | 'worker';
export type HostStage =
  | 'Starting installation'
  | 'Waiting for control plane'
  | 'Start waiting for control plane'
  | 'Installing'
  | 'Writing image to disk'
  | 'Rebooting'
  | 'Waiting for ignition'
  | 'Configuring'
  | 'Joined'
  | 'Done'
  | 'Failed';
export type HostValidationId =
  | 'connected'
  | 'has-inventory'
  | 'has-min-cpu-cores'
  | 'has-min-valid-disks'
  | 'has-min-memory'
  | 'machine-cidr-defined'
  | 'role-defined'
  | 'has-cpu-cores-for-role'
  | 'has-memory-for-role'
  | 'hostname-unique'
  | 'hostname-valid'
  | 'belongs-to-machine-cidr'
  | 'api-vip-connected'
  | 'belongs-to-majority-group'
  | 'valid-platform'
  | 'ntp-synced';
export interface ImageCreateParams {
  /**
   * SSH public key for debugging the installation.
   */
  sshPublicKey?: string;
}
export interface ImageInfo {
  /**
   * SSH public key for debugging the installation.
   */
  sshPublicKey?: string;
  sizeBytes?: number;
  downloadUrl?: string;
  /**
   * Image generator version.
   */
  generatorVersion?: string;
  createdAt?: string; // date-time
  expiresAt?: string; // date-time
}
export interface InfraError {
  /**
   * Numeric identifier of the error.
   */
  code: number; // int32
  /**
   * Human-readable description of the error.
   */
  message: string;
}
export type IngressCertParams = string;
export interface InstallerArgsParams {
  /**
   * List of additional arguments passed to coreos-installer
   * example:
   * --append-karg,ip=192.0.2.2::192.0.2.254:255.255.255.0:core0.example.com:enp1s0:none,--save-partindex,1,-n
   */
  args?: string[];
}
export interface Interface {
  ipv6Addresses?: string[];
  vendor?: string;
  name?: string;
  hasCarrier?: boolean;
  product?: string;
  mtu?: number;
  ipv4Addresses?: string[];
  biosdevname?: string;
  clientId?: string;
  macAddress?: string;
  flags?: string[];
  speedMbps?: number;
}
export interface Inventory {
  hostname?: string;
  bmcAddress?: string;
  interfaces?: Interface[];
  disks?: Disk[];
  boot?: Boot;
  systemVendor?: SystemVendor;
  bmcV6address?: string;
  memory?: Memory;
  cpu?: Cpu;
  timestamp?: number;
}
export interface L2Connectivity {
  outgoingNic?: string;
  outgoingIpAddress?: string;
  remoteIpAddress?: string;
  remoteMac?: string;
  successful?: boolean;
}
export interface L3Connectivity {
  outgoingNic?: string;
  remoteIpAddress?: string;
  successful?: boolean;
}
export type ListManagedDomains = ManagedDomain[];
export type ListManifests = Manifest[];
export interface ListVersions {
  versions?: Versions;
  releaseTag?: string;
}
export type LogsType = 'host' | 'controller' | 'all' | '';
export interface ManagedDomain {
  domain?: string;
  provider?: 'route53';
}
export interface Manifest {
  /**
   * The folder that contains the files. Manifests can be placed in 'manifests' or 'openshift' directories.
   */
  folder?: 'manifests' | 'openshift';
  /**
   * The file name prefaced by the folder that contains it.
   */
  fileName?: string;
}
export interface Memory {
  physicalBytes?: number;
  usableBytes?: number;
}
export interface NtpSource {
  /**
   * NTP source name or IP.
   */
  sourceName?: string;
  /**
   * Indication of state of an NTP source.
   */
  sourceState?: SourceState;
}
export interface NtpSynchronizationRequest {
  /**
   * NTP source name or IP.
   */
  ntpSource: string;
}
export interface NtpSynchronizationResponse {
  ntpSources?: NtpSource[];
}
export interface Presigned {
  url: string;
}
export type SourceState =
  | 'synced'
  | 'combined'
  | 'notCombined'
  | 'error'
  | 'variable'
  | 'unreachable';
export interface Step {
  stepType?: StepType;
  stepId?: string;
  command?: string;
  args?: string[];
}
export interface StepReply {
  stepType?: StepType;
  stepId?: string;
  exitCode?: number;
  output?: string;
  error?: string;
}
export type StepType =
  | 'connectivity-check'
  | 'execute'
  | 'inventory'
  | 'install'
  | 'free-network-addresses'
  | 'reset-installation'
  | 'dhcp-lease-allocate'
  | 'api-vip-connectivity-check'
  | 'ntp-synchronizer';
export interface Steps {
  nextInstructionSeconds?: number;
  /**
   * What to do after finishing to run step instructions
   */
  postStepAction?: 'exit' | 'continue';
  instructions?: Step[];
}
export type StepsReply = StepReply[];
export interface SystemVendor {
  serialNumber?: string;
  productName?: string;
  manufacturer?: string;
  /**
   * Whether the machine appears to be a virtual machine or not
   */
  virtual?: boolean;
}
export interface Versions {
  [name: string]: string;
}
