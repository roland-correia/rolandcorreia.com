// Reading settings: text size, spacing, background, and one-card-at-a-time.
// Saved in this browser's localStorage. The tiny inline script in Base.astro
// applies them before first paint; this file wires up the dialog and saves changes.

const KEY = 'ds-settings';

const allowed = {
  size: ['sm', 'md', 'lg'],
  space: ['normal', 'roomy'],
  bg: ['auto', 'soft', 'cream', 'dark'],
  flow: ['cards', 'page'],
} as const;

type SettingName = keyof typeof allowed;

function isSetting(name: string): name is SettingName {
  return name in allowed;
}

function readSaved(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '{}');
  } catch {
    return {};
  }
}

function save(name: SettingName, value: string) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ ...readSaved(), [name]: value }));
  } catch {
    // Private browsing can block storage. The choice still applies for this visit.
  }
}

const dialog = document.getElementById('settings') as HTMLDialogElement | null;

if (dialog) {
  // Tick the option that is currently active.
  for (const name of Object.keys(allowed) as SettingName[]) {
    const value = document.documentElement.dataset[name];
    const input = dialog.querySelector<HTMLInputElement>(`input[name="${name}"][value="${value}"]`);
    if (input) input.checked = true;
  }

  document.querySelectorAll('[data-open-settings]').forEach((button) => {
    button.addEventListener('click', () => dialog.showModal());
  });

  dialog.addEventListener('change', (event) => {
    const input = event.target as HTMLInputElement;
    if (input.type !== 'radio' || !isSetting(input.name)) return;
    if (!(allowed[input.name] as readonly string[]).includes(input.value)) return;

    document.documentElement.dataset[input.name] = input.value;
    save(input.name, input.value);
    document.dispatchEvent(new CustomEvent('ds:settings'));
  });

  // A click on the dimmed backdrop lands on the <dialog> element itself.
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
}
