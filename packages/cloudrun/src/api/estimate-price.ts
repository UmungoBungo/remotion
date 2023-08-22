import type {GcpRegion} from '../pricing/gcp-regions';
import {pricing} from '../pricing/price-per-1-s';
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
	validateMemorySize(memoryInGiB);
	validateGcpRegion(region);
	validateDiskSizeInMb(diskSizeInMb);
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

	const durationPrice = pricing[region]['Lambda Duration-ARM'].price;

	// In GB-second
	const timeCostDollars =
		Number(durationPrice) *
		((memorySizeInMb * durationInMilliseconds) / 1000 / 1024);

	const diskSizePrice = pricing[region]['Lambda Storage-Duration-ARM'].price;

	const chargedDiskSize = Math.max(
		0,
		diskSizeInMb - MIN_EPHEMERAL_STORAGE_IN_MB
	);
	// In GB-second
	const diskSizeDollars =
		chargedDiskSize *
		Number(diskSizePrice) *
		(durationInMilliseconds / 1000 / 1024);

	const invocationCost =
		Number(pricing[region]['Lambda Requests'].price) * lambdasInvoked;

	return Number(
		(timeCostDollars + diskSizeDollars + invocationCost).toFixed(5)
	);
};
