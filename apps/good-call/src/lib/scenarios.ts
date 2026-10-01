import { getCollection, type CollectionEntry } from 'astro:content';
import { sets, type SetId } from './site';

export type Scenario = CollectionEntry<'scenarios'>;

// Drafts appear while you work (`npm run dev`) and in a preview built with
// PUBLIC_SHOW_DRAFTS=true. A normal build for the live site leaves them out.
const showDrafts = import.meta.env.DEV || import.meta.env.PUBLIC_SHOW_DRAFTS === 'true';

export async function getScenarios(set: SetId): Promise<Scenario[]> {
  const all = await getCollection('scenarios', ({ data }) => data.set === set && (showDrafts || !data.draft));
  return all.sort((a, b) => a.data.order - b.data.order);
}

// The sets that have a page: marked live and with at least one scenario to show.
export async function getLiveSets(): Promise<{ id: SetId; scenarios: Scenario[] }[]> {
  const ids = (Object.keys(sets) as SetId[]).filter((id) => sets[id].live);
  const loaded = await Promise.all(ids.map(async (id) => ({ id, scenarios: await getScenarios(id) })));
  return loaded.filter((set) => set.scenarios.length > 0);
}

// The file name without its folder: 'consent/hug-hello' becomes 'hug-hello'.
export const slugOf = (scenario: Scenario) => scenario.id.split('/').pop()!;

export const pathOf = (scenario: Scenario) => `/practice/${scenario.data.set}/${slugOf(scenario)}/`;
