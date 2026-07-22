import type { ModelCompatConfig } from "../config/types.models.js";

type ModelTransportRoute = {
  api?: unknown;
  baseUrl?: unknown;
};

function normalizeApi(value: unknown): string {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function normalizeBaseUrl(value: unknown): string {
  if (typeof value !== "string") {
    return "";
  }
  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }
  try {
    const url = new URL(trimmed);
    url.pathname = url.pathname.replace(/\/+$/u, "") || "/";
    return url.toString();
  } catch {
    return trimmed.replace(/\/+$/u, "");
  }
}

export function modelTransportRoutesMatch(
  catalogRoute: ModelTransportRoute,
  configuredRoute: ModelTransportRoute,
): boolean {
  const catalogApi = normalizeApi(catalogRoute.api);
  const catalogBaseUrl = normalizeBaseUrl(catalogRoute.baseUrl);
  return (
    (normalizeApi(configuredRoute.api) || catalogApi) === catalogApi &&
    (normalizeBaseUrl(configuredRoute.baseUrl) || catalogBaseUrl) === catalogBaseUrl
  );
}

/** Capabilities belong to the catalog route; config owns them only for a different/custom route. */
export function resolveCatalogOwnedModelCompat(params: {
  catalogRoute?: ModelTransportRoute;
  catalogCompat?: ModelCompatConfig;
  configuredRoute?: ModelTransportRoute;
  configuredCompat?: ModelCompatConfig;
}): ModelCompatConfig | undefined {
  if (!params.catalogRoute) {
    return params.configuredCompat;
  }
  return modelTransportRoutesMatch(params.catalogRoute, params.configuredRoute ?? {})
    ? params.catalogCompat
    : params.configuredCompat;
}
