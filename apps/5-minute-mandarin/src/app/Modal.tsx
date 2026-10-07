// A dialog using the browser's own <dialog>, which traps focus and closes on Escape.
import { useEffect, useRef } from 'preact/hooks';
import type { ComponentChildren } from 'preact';

export function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ComponentChildren }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    ref.current?.showModal();
  }, []);
  return (
    <dialog
      class="settings modal"
      ref={ref}
      aria-label={title}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && ref.current?.close()}
    >
      <div class="modal-body">
        <h2>{title}</h2>
        {children}
        <button type="button" class="btn ghost block" onClick={() => ref.current?.close()}>
          Close
        </button>
      </div>
    </dialog>
  );
}
