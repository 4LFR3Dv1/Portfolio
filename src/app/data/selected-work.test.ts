import { describe, expect, it } from 'vitest';
import { selectedWork } from './selected-work';

describe('selected work curation', () => {
  it('publishes the current five-item selection', () => {
    expect(selectedWork.map((item) => item.id)).toEqual([
      'genesis',
      'factory',
      'lisa',
      'vira',
      'foundry-pay-channels',
    ]);

    expect(selectedWork.some((item) => item.id === 'foundry')).toBe(false);
    expect(selectedWork.some((item) => item.id === 'xs-wallet')).toBe(false);
  });

  it('links Genesis and Factory to current case studies', () => {
    expect(selectedWork.find((item) => item.id === 'genesis')?.caseStudyId).toBe('genesis');
    expect(selectedWork.find((item) => item.id === 'factory')?.caseStudyId).toBe('factory');
  });

  it('publishes Lisa official site and app links', () => {
    const lisa = selectedWork.find((item) => item.id === 'lisa');
    expect(lisa?.links?.map((link) => link.href)).toEqual([
      'https://assistentelisa.online/',
      'https://app.assistentelisa.online/',
    ]);
  });

  it('publishes both Foundry payment repositories', () => {
    const payments = selectedWork.find((item) => item.id === 'foundry-pay-channels');
    expect(payments?.links?.map((link) => link.href)).toEqual([
      'https://github.com/4LFR3Dv1/Foundry-Pay',
      'https://github.com/4LFR3Dv1/Foundry-Channels',
    ]);
  });
});
