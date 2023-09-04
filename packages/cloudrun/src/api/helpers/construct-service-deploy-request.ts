import {VERSION} from 'remotion/version';
import type {GcpRegion} from '../../pricing/gcp-regions';

// taken from within the @google-cloud/run package, can't import it directly
enum ExecutionEnvironment {
	EXECUTION_ENVIRONMENT_UNSPECIFIED = 0,
	EXECUTION_ENVIRONMENT_GEN1 = 1,
	EXECUTION_ENVIRONMENT_GEN2 = 2,
}

export const constructServiceTemplate = ({
	region,
	memoryLimit,
	cpuLimit,
	timeoutSeconds,
	minInstances,
	maxInstances,
}: {
	region: GcpRegion;
	memoryLimit: string;
	cpuLimit: string;
	timeoutSeconds: number;
	minInstances: number;
	maxInstances: number;
}) => {
	return {
		scaling: {
			minInstanceCount: minInstances,
			maxInstanceCount: maxInstances,
		},
		timeout: {
			seconds: timeoutSeconds,
		},
		containers: [
			{
				image: `us-docker.pkg.dev/remotion-dev/production/render:${VERSION}`,
				env: [
					{
						name: 'GCP_CLOUDRUN_SERVICE_MEMORY_LIMIT',
						value: memoryLimit,
					},
					{
						name: 'GCP_CLOUDRUN_SERVICE_CPU_LIMIT',
						value: cpuLimit,
					},
					{
						name: 'GCP_CLOUDRUN_REGION',
						value: region,
					},
				],
				resources: {
					limits: {
						memory: memoryLimit,
						cpu: cpuLimit,
					},
				},
			},
		],
		maxInstanceRequestConcurrency: 1,
		executionEnvironment: ExecutionEnvironment.EXECUTION_ENVIRONMENT_GEN1,
	};
};
