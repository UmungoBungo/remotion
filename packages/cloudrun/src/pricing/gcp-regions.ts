export const GCP_TIER_1_REGIONS = [
	'asia-east1',
	'asia-northeast1',
	'asia-northeast2',
	'europe-north1',
	'europe-southwest1',
	'europe-west1',
	'europe-west4',
	'europe-west8',
	'europe-west9',
	'me-west1',
	'us-central1',
	'us-east1',
	'us-east4',
	'us-east5',
	'us-south1',
	'us-west1',
] as const;

export const GCP_TIER_2_REGIONS = [
	'asia-east2',
	'asia-northeast3',
	'asia-southeast1',
	'asia-southeast2',
	'asia-south1',
	'asia-south2',
	'australia-southeast1',
	'australia-southeast2',
	'europe-central2',
	'europe-west2',
	'europe-west3',
	'europe-west6',
	'europe-west12',
	'me-central1',
	'northamerica-northeast1',
	'northamerica-northeast2',
	'southamerica-east1',
	'southamerica-west1',
	'us-west2',
	'us-west3',
	'us-west4',
] as const;

export const GCP_REGIONS = [
	...GCP_TIER_1_REGIONS,
	...GCP_TIER_2_REGIONS,
] as const;

// Keep pricing up to date from here - https://cloud.google.com/run/pricing
export const PRICING = {
	'Tier 1': {
		VCPU_SECOND: 0.000024,
		VCPU_FREE_HOURS: 50,
		GIB_SECOND: 0.0000025,
		GIB_FREE_HOURS: 100,
	},
	'Tier 2': {
		VCPU_SECOND: 0.0000336,
		VCPU_FREE_HOURS: 35,
		GIB_SECOND: 0.0000035,
		GIB_FREE_HOURS: 70,
	},
};

export type GcpRegion = (typeof GCP_REGIONS)[number];
