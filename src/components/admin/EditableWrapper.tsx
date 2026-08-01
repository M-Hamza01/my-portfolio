"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Pencil, Plus, X } from "lucide-react";
import { useIsOwner } from "@/lib/useIsOwner";
import { cn } from "@/lib/utils";

interface EditableWrapperProps {
  /** The rendered content (a StickyNote, NotebookCard, ProjectCard...). */
  children: React.ReactNode;
  /** The edit form to show in the drawer. Receives a `close` callback. */
  renderEditor: (close: () => void) => React.ReactNode;
  /** Use "add" styling (+ icon, dashed outline) for empty/new-item slots. */
  mode?: "edit" | "add";
  label?: string;
  className?: string;
}

/**
 * Wrap any content block with this to make it editable in place.
 *
 * <EditableWrapper renderEditor={(close) => <ProjectForm project={p} onDone={close} />}>
 *   <ProjectCard project={p} />
 * </EditableWrapper>
 *
 * When signed out, this renders `children` only — zero visual or
 * bundle overhead for real visitors.
 */
export function EditableWrapper({
  children,
  renderEditor,
  mode = "edit",
  label,
  className,
}: EditableWrapperProps) {
  const { isOwner } = useIsOwner();
  const [open, setOpen] = useState(false);

  if (!isOwner) return <>{children}</>;

  return (
    <div className={cn("group/editable relative", className)}>
      {children}

      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={label ?? (mode === "add" ? "Add item" : "Edit item")}
        className={cn(
          "absolute -top-2 -right-2 z-10 flex h-8 w-8 items-center justify-center rounded-full border shadow-md transition-opacity",
          "opacity-0 group-hover/editable:opacity-100 focus-visible:opacity-100",
          mode === "add"
            ? "border-dashed border-(--color-pen-blue) bg-white text-(--color-pen-blue)"
            : "border-(--color-ink-faint) bg-white text-(--color-ink-soft)"
        )}
      >
        {mode === "add" ? <Plus size={16} /> : <Pencil size={14} />}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-(--color-ink)/30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              className="fixed top-0 right-0 z-50 h-full w-full max-w-md overflow-y-auto bg-(--color-paper) p-6 shadow-2xl"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-(family-name:--font-display) text-lg font-semibold">
                  {label ?? (mode === "add" ? "Add item" : "Edit item")}
                </h3>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  className="text-(--color-ink-soft) hover:text-(--color-ink)"
                >
                  <X size={20} />
                </button>
              </div>
              {renderEditor(() => setOpen(false))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
