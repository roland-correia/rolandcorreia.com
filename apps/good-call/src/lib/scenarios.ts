import { getCollection, type CollectionEntry } from 'astro:content';
import { sets, categories, type SetId } from './site';

export type Scenario = CollectionEntry<'scenarios'>;

// Drafts appear while you work (`npm run dev`) and in a preview built with
// PUBLIC_SHOW_DRAFTS=true. A normal build for the live site leaves them out.
const showDrafts = import.meta.env.DEV || import.meta.env.PUBLIC_SHOW_DRAFTS === 'true';

export async function getScenarios(set: SetId): Promise<Scenario[]> {
  const all = await getCollection('scenarios', ({ data }) => data.set === set && (showDrafts || !data.draft));
  // Category first, in the order the categories are written, then `order` within it.
  const categoryIds = Object.keys(categories[set] ?? {});
  const rank = (scenario: Scenario) => categoryIds.indexOf(scenario.data.category ?? '');
  return all.sort((a, b) => rank(a) - rank(b) || a.data.order - b.data.order);
}

export interface Section {
  id: string;
  name: string;
  blurb: string;
  scenarios: Scenario[];
}

// The set's scenarios split into its categories, leaving out any that are empty.
// Returns an empty list for a set without categories, which is shown as one list.
export function sectionsOf(set: SetId, scenarios: Scenario[]): Section[] {
  return Object.entries(categories[set] ?? {})
    .map(([id, category]) => ({ id, ...category, scenarios: scenarios.filter((s) => s.data.category === id) }))
    .filter((section) => section.scenarios.length > 0);
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
