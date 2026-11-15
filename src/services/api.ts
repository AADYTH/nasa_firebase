/**
 * Service layer for data fetching and integration.
 * Designed to interact with local datasets or verified NASA Open APIs.
 * Note: Keeps all API configuration externalized via environment variables (no hardcoded keys).
 */

export interface ServiceResponse<T> {
  data: T | null;
  error: string | null;
  isLoading: boolean;
}

export const fetchExperimentMetadata = async (
  recordId: string
): Promise<ServiceResponse<unknown>> => {
  // Foundation stub: will load verified NASA PSI dataset manifests
  return {
    data: { recordId, status: 'awaiting_data_source' },
    error: null,
    isLoading: false,
  };
};
