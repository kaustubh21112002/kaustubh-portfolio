/**
 * Candidate Claim Store and Review State Machine
 * 
 * Invariants:
 * 1. Strict status transitions based on ALLOWED_STATUS_TRANSITIONS.
 * 2. Immutable history trail for every claim mutation.
 * 3. AI suggestions or portfolio artifacts NEVER automatically become CONFIRMED.
 * 4. Confirmation is strictly attributable to an explicit user action with timestamp.
 */

import type {
  CandidateClaim,
  VerificationStatus,
  CanonicalCandidateProfile
} from '../types/candidate.js';

export const ALLOWED_STATUS_TRANSITIONS: Record<VerificationStatus, ReadonlySet<VerificationStatus>> = {
  EXTRACTED: new Set(['CONFIRMED', 'CORRECTED', 'REJECTED', 'UNKNOWN']),
  CONFIRMED: new Set(['CORRECTED', 'REJECTED', 'UNKNOWN']), // Can be re-reviewed and corrected
  CORRECTED: new Set(['CONFIRMED', 'REJECTED', 'UNKNOWN']), // Can be re-confirmed or rejected
  REJECTED: new Set(['CONFIRMED', 'CORRECTED', 'UNKNOWN']), // Can be reconsidered
  UNKNOWN: new Set(['EXTRACTED', 'CONFIRMED', 'CORRECTED', 'REJECTED']),
  AI_SUGGESTION: new Set(['CONFIRMED', 'CORRECTED', 'REJECTED', 'UNKNOWN'])
};

export class CandidateClaimStore {
  private claims: Map<string, CandidateClaim> = new Map();
  private listeners: Set<() => void> = new Set();

  constructor(initialClaims: CandidateClaim[] = []) {
    for (const claim of initialClaims) {
      this.claims.set(claim.claimId, { ...claim });
    }
  }

  /**
   * Subscribes a listener callback to receive updates whenever claims change.
   */
  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    for (const listener of this.listeners) {
      try {
        listener();
      } catch (err) {
        // Safe emission
      }
    }
  }

  /**
   * Adds a new claim to the store.
   * If a claim with claimId exists, throws an error to avoid silent overwrites.
   */
  public addClaim(claim: CandidateClaim): void {
    if (this.claims.has(claim.claimId)) {
      throw new Error(`Claim with ID "${claim.claimId}" already exists. Use updateClaim instead.`);
    }
    this.claims.set(claim.claimId, { ...claim });
    this.notify();
  }

  /**
   * Retrieves a claim by ID.
   */
  public getClaim(claimId: string): CandidateClaim | undefined {
    const claim = this.claims.get(claimId);
    return claim ? { ...claim } : undefined;
  }

  /**
   * Lists all claims, optionally filtered by status or type.
   */
  public listClaims(filter?: {
    status?: VerificationStatus;
    claimType?: CandidateClaim['claimType'];
  }): CandidateClaim[] {
    let result = Array.from(this.claims.values());
    if (filter?.status) {
      result = result.filter((c) => c.verificationStatus === filter.status);
    }
    if (filter?.claimType) {
      result = result.filter((c) => c.claimType === filter.claimType);
    }
    return result.map((c) => ({ ...c }));
  }

  /**
   * Confirms an extracted, suggested, or corrected claim via an explicit user action.
   */
  public confirmClaim(
    claimId: string,
    actor: string,
    options?: { permittedUse?: CandidateClaim['permittedUse']; note?: string }
  ): CandidateClaim {
    const current = this.claims.get(claimId);
    if (!current) {
      throw new Error(`Cannot confirm non-existent claim "${claimId}".`);
    }

    this.validateTransition(current.verificationStatus, 'CONFIRMED');

    const now = new Date().toISOString();
    const historyEntry = {
      previousStatus: current.verificationStatus,
      previousValue: current.claimValue,
      changedAt: now,
      changedBy: actor,
      reason: options?.note || 'Explicit candidate confirmation'
    };

    const updated: CandidateClaim = {
      ...current,
      verificationStatus: 'CONFIRMED',
      confirmedAt: now,
      confirmedBy: actor,
      lastModifiedAt: now,
      permittedUse: options?.permittedUse || current.permittedUse,
      history: [...(current.history || []), historyEntry]
    };

    this.claims.set(claimId, updated);
    this.notify();
    return { ...updated };
  }

  /**
   * Corrects a claim's value and sets status to CORRECTED (or re-evaluates confirmation).
   */
  public correctClaim(
    claimId: string,
    newValue: unknown,
    actor: string,
    options?: { reason?: string; autoConfirm?: boolean }
  ): CandidateClaim {
    const current = this.claims.get(claimId);
    if (!current) {
      throw new Error(`Cannot correct non-existent claim "${claimId}".`);
    }

    const nextStatus: VerificationStatus = options?.autoConfirm ? 'CONFIRMED' : 'CORRECTED';
    this.validateTransition(current.verificationStatus, nextStatus);

    const now = new Date().toISOString();
    const historyEntry = {
      previousStatus: current.verificationStatus,
      previousValue: current.claimValue,
      changedAt: now,
      changedBy: actor,
      reason: options?.reason || 'Candidate value correction'
    };

    const updated: CandidateClaim = {
      ...current,
      claimValue: newValue,
      verificationStatus: nextStatus,
      confirmedAt: options?.autoConfirm ? now : undefined,
      confirmedBy: options?.autoConfirm ? actor : undefined,
      lastModifiedAt: now,
      history: [...(current.history || []), historyEntry]
    };

    this.claims.set(claimId, updated);
    this.notify();
    return { ...updated };
  }

  /**
   * Rejects an extracted claim.
   */
  public rejectClaim(claimId: string, actor: string, reason?: string): CandidateClaim {
    const current = this.claims.get(claimId);
    if (!current) {
      throw new Error(`Cannot reject non-existent claim "${claimId}".`);
    }

    this.validateTransition(current.verificationStatus, 'REJECTED');

    const now = new Date().toISOString();
    const historyEntry = {
      previousStatus: current.verificationStatus,
      previousValue: current.claimValue,
      changedAt: now,
      changedBy: actor,
      reason: reason || 'Candidate rejected claim'
    };

    const updated: CandidateClaim = {
      ...current,
      verificationStatus: 'REJECTED',
      permittedUse: 'DO_NOT_USE',
      lastModifiedAt: now,
      history: [...(current.history || []), historyEntry]
    };

    this.claims.set(claimId, updated);
    this.notify();
    return { ...updated };
  }

  /**
   * Marks a claim as UNKNOWN when information is missing or unverified.
   */
  public markClaimUnknown(claimId: string, actor: string, reason?: string): CandidateClaim {
    const current = this.claims.get(claimId);
    if (!current) {
      throw new Error(`Cannot mark non-existent claim "${claimId}" as unknown.`);
    }

    this.validateTransition(current.verificationStatus, 'UNKNOWN');

    const now = new Date().toISOString();
    const historyEntry = {
      previousStatus: current.verificationStatus,
      previousValue: current.claimValue,
      changedAt: now,
      changedBy: actor,
      reason: reason || 'Marked as unverified / unknown'
    };

    const updated: CandidateClaim = {
      ...current,
      verificationStatus: 'UNKNOWN',
      permittedUse: 'DO_NOT_USE',
      lastModifiedAt: now,
      history: [...(current.history || []), historyEntry]
    };

    this.claims.set(claimId, updated);
    this.notify();
    return { ...updated };
  }

  /**
   * Validates whether a requested transition is permitted by the state machine.
   */
  private validateTransition(from: VerificationStatus, to: VerificationStatus): void {
    if (from === to) return; // Idempotent same-status transitions are permitted
    const allowed = ALLOWED_STATUS_TRANSITIONS[from];
    if (!allowed || !allowed.has(to)) {
      throw new Error(`Illegal status transition from "${from}" to "${to}".`);
    }
  }

  /**
   * Assembles a canonical view of the profile strictly from confirmed and known claims.
   * Unconfirmed claims are represented with their actual verification status.
   */
  public assembleCanonicalProfile(profileId: string = 'canonical_candidate'): CanonicalCandidateProfile {
    const allClaims = Array.from(this.claims.values());

    const findClaim = (key: string) => allClaims.find((c) => c.claimKey === key);

    const identityClaim = findClaim('identity.name');
    const summaryClaim = findClaim('summary.overview');
    const contactEmail = findClaim('contact.email');
    const contactPhone = findClaim('contact.phone');
    const contactCity = findClaim('contact.city');
    const contactCountry = findClaim('contact.country');

    const prefSalary = findClaim('preference.minSalary');
    const prefLocations = findClaim('preference.locations');
    const prefNotice = findClaim('preference.noticePeriod');
    const prefTitles = findClaim('preference.targetTitles');
    const prefWorkModel = findClaim('preference.workModel');

    const profile: CanonicalCandidateProfile = {
      profileId,
      updatedAt: new Date().toISOString(),
      identity: {
        fullName: typeof identityClaim?.claimValue === 'string' ? identityClaim.claimValue : 'Unspecified',
        status: identityClaim?.verificationStatus || 'UNKNOWN'
      },
      contact: {
        email: typeof contactEmail?.claimValue === 'string' ? contactEmail.claimValue : 'Unspecified',
        phone: typeof contactPhone?.claimValue === 'string' ? contactPhone.claimValue : 'Unspecified',
        locationCity: typeof contactCity?.claimValue === 'string' ? contactCity.claimValue : 'Unspecified',
        locationCountry: typeof contactCountry?.claimValue === 'string' ? contactCountry.claimValue : 'India',
        status: contactEmail?.verificationStatus || 'UNKNOWN'
      },
      summary: {
        text: typeof summaryClaim?.claimValue === 'string' ? summaryClaim.claimValue : 'Unspecified',
        status: summaryClaim?.verificationStatus || 'UNKNOWN'
      },
      employment: [],
      skills: [],
      education: [],
      portfolioProjects: [],
      preferences: {
        targetJobTitles: Array.isArray(prefTitles?.claimValue) ? (prefTitles!.claimValue as string[]) : [],
        minimumBaseSalaryInr: typeof prefSalary?.claimValue === 'number' ? prefSalary.claimValue : null,
        preferredLocations: Array.isArray(prefLocations?.claimValue) ? (prefLocations!.claimValue as string[]) : [],
        workModelPreference: (prefWorkModel?.claimValue as any) || 'UNKNOWN',
        noticePeriodDays: typeof prefNotice?.claimValue === 'number' ? prefNotice.claimValue : null,
        willingToRelocate: false,
        status: prefSalary?.verificationStatus || 'UNKNOWN'
      }
    };

    // Populate skills from claims
    const skillClaims = allClaims.filter((c) => c.claimType === 'SKILL_PROFICIENCY');
    for (const sc of skillClaims) {
      const val = sc.claimValue as any;
      if (val && typeof val.name === 'string') {
        profile.skills.push({
          skillId: sc.claimId,
          name: val.name,
          category: val.category || 'TECHNICAL',
          proficiency: val.proficiency || 'UNKNOWN',
          demonstratedInProjectSlug: sc.evidenceReference?.projectSlug,
          status: sc.verificationStatus
        });
      }
    }

    // Populate portfolio projects from claims
    const projectClaims = allClaims.filter((c) => c.claimType === 'PORTFOLIO_PROJECT');
    for (const pc of projectClaims) {
      const val = pc.claimValue as any;
      const contributionClaim = findClaim(`project.${val.slug}.contribution`);
      profile.portfolioProjects.push({
        projectSlug: val.slug,
        title: val.title,
        domain: val.domain || 'ANALYTICS',
        demonstratedMetrics: val.metrics || {},
        candidatePersonalContribution: {
          description: typeof contributionClaim?.claimValue === 'string' ? contributionClaim.claimValue : 'Unconfirmed',
          isCandidateConfirmed: contributionClaim?.verificationStatus === 'CONFIRMED',
          confirmedAt: contributionClaim?.confirmedAt
        },
        status: pc.verificationStatus
      });
    }

    return profile;
  }
}

