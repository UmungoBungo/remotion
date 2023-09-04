import type {GcpRegion, Tier} from '../pricing/gcp-regions';
import {
	GCP_TIER_1_REGIONS,
	GCP_TIER_2_REGIONS,
	pricing,
} from '../pricing/gcp-regions';
import {validateGcpRegion} from '../shared/validate-gcp-region';

export type EstimatePriceInput = {
	region: GcpRegion;
	durationInMilliseconds: number;
	memoryInGiB: number;
	vCpusAllocated: number;
};
/**
 *
 * @description Calculates the GCP costs incurred for GCP Cloud Run given the region, execution duration, memory size and number of vCPUs.
 * @see [Documentation](https://remotion.dev/docs/cloudrun/estimateprice)
 * @returns {number} Price in USD
 */
export const estimatePrice = ({
	region,
	durationInMilliseconds,
	memoryInGiB,
	vCpusAllocated,
}: EstimatePriceInput): number => {
	// validateMemorySize(memoryInGiB);
	validateGcpRegion(region);
	// validateDiskSizeInMb(diskSizeInMb);
	if (typeof durationInMilliseconds !== 'number') {
		throw new TypeError(
			`Parameter 'durationInMilliseconds' must be a number but got ${typeof durationInMilliseconds}`
		);
	}

	if (Number.isNaN(durationInMilliseconds)) {
		throw new TypeError(
			`Parameter 'durationInMilliseconds' must not be NaN but it is.`
		);
	}

	if (!Number.isFinite(durationInMilliseconds)) {
		throw new TypeError(
			`Parameter 'durationInMilliseconds' must be finite but it is ${durationInMilliseconds}`
		);
	}

	if (durationInMilliseconds < 0) {
		throw new TypeError(
			`Parameter 'durationInMilliseconds' must be over 0 but it is ${durationInMilliseconds}.`
		);
	}

	let tier: Tier;

	if (GCP_TIER_1_REGIONS.includes(region as any)) {
		tier = 'Tier_1';
	} else if (GCP_TIER_2_REGIONS.includes(region as any)) {
		tier = 'Tier_2';
	} else {
		throw new TypeError(
			`Parameter 'region' must be a valid GCP region from Tier 1 or Tier 2, but it is ${region}.`
		);
	}

	const vCpuPrice = pricing[tier].VCPU_SECOND;
	const memoryPrice = pricing[tier].GIB_SECOND;

	// In GB-second
	const vCpuCost = (durationInMilliseconds / 1000) * vCpusAllocated * vCpuPrice;
	const memoryCost =
		(durationInMilliseconds / 1000) * memoryInGiB * memoryPrice;

	return Number((vCpuCost + memoryCost).toFixed(5));
};
