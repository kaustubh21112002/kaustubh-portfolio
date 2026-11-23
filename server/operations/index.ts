export * from './types';
export * from './agenticWorkflows';
export * from './b2bCampaigns';
export * from './candidateIntelligence';
export * from './cloudFinOps';
export * from './crm';
export * from './erpSync';
export * from './executiveOutreach';
export * from './financialAnalytics';
export * from './regulatoryCompliance';
export * from './reliabilityChaos';
export * from './renderFleet';
export * from './smeAnalytics';
export * from './systemWatchdog';
export * from './telemetryPostMortems';
export * from './tickets';

import handleAgenticWorkflows from './agenticWorkflows';
import handleB2bCampaigns from './b2bCampaigns';
import handleCandidateIntelligence from './candidateIntelligence';
import handleCloudFinOps from './cloudFinOps';
import handleCrm from './crm';
import handleErpSync from './erpSync';
import handleExecutiveOutreach from './executiveOutreach';
import handleFinancialAnalytics from './financialAnalytics';
import handleRegulatoryCompliance from './regulatoryCompliance';
import handleReliabilityChaos from './reliabilityChaos';
import handleRenderFleet from './renderFleet';
import handleSmeAnalytics from './smeAnalytics';
import handleSystemWatchdog from './systemWatchdog';
import handleTelemetryPostMortems from './telemetryPostMortems';
import handleTickets from './tickets';

import type { VercelRequest, VercelResponse } from './types';

export type OperationHandler = (req: VercelRequest, res: VercelResponse) => Promise<void>;

export const operationsRouter: Record<string, OperationHandler> = {
  agenticworkflows: handleAgenticWorkflows,
  b2bcampaigns: handleB2bCampaigns,
  candidateintelligence: handleCandidateIntelligence,
  cloudfinops: handleCloudFinOps,
  crm: handleCrm,
  erpsync: handleErpSync,
  executiveoutreach: handleExecutiveOutreach,
  financialanalytics: handleFinancialAnalytics,
  regulatorycompliance: handleRegulatoryCompliance,
  reliabilitychaos: handleReliabilityChaos,
  renderfleet: handleRenderFleet,
  smeanalytics: handleSmeAnalytics,
  systemwatchdog: handleSystemWatchdog,
  telemetrypostmortems: handleTelemetryPostMortems,
  tickets: handleTickets
};
