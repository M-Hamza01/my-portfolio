"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Pencil, Eraser, Undo2, Redo2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Point {
  x: number;
  y: number;
}

interface Stroke {
  tool: "pen" | "eraser";
  color: string;
  size: number;
  points: Point[];
}

const COLORS = [
  { id: "ink", hex: "#2b2620" },
  { id: "red", hex: "#a83a2e" },
  { id: "blue", hex: "#2f4858" },
  { id: "green", hex: "#4a6b3f" },
  { id: "purple", hex: "#7a4f9e" },
  { id: "orange", hex: "#d17a2f" },
];
const SIZES = [3, 6, 12];

export interface DoodleCanvasHandle {
  getDataUrl: () => string | null;
  isEmpty: () => boolean;
  clear: () => void;
}

interface DoodleCanvasProps {
  width?: number;
  height?: number;
  className?: string;
}

export const DoodleCanvas = forwardRef<DoodleCanvasHandle, DoodleCanvasProps>(
  function DoodleCanvas({ width = 480, height = 260, className }, ref) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [strokes, setStrokes] = useState<Stroke[]>([]);
    const [redoStack, setRedoStack] = useState<Stroke[]>([]);
    const [tool, setTool] = useState<"pen" | "eraser">("pen");
    const [color, setColor] = useState(COLORS[0].hex);
    const [size, setSize] = useState(SIZES[1]);
    const drawingRef = useRef(false);
    const currentStrokeRef = useRef<Stroke | null>(null);

    function drawStroke(ctx: CanvasRenderingContext2D, stroke: Stroke) {
      ctx.save();
      // Eraser paints opaque white rather than cutting true alpha
      // transparency — otherwise erased spots show whatever the doodle
      // ends up displayed on top of later (e.g. the guestbook board),
      // not a clean white the way a real eraser reveals paper.
      ctx.globalCompositeOperation = "source-over";
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      if (stroke.points.length < 2) {
        const p = stroke.points[0];
        if (p) {
          ctx.fillStyle = stroke.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, stroke.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
        return;
      }

      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.size;
      ctx.beginPath();
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
      }
      ctx.stroke();
      ctx.restore();
    }

    function redraw(extra?: Stroke | null) {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      for (const s of strokes) drawStroke(ctx, s);
      if (extra) drawStroke(ctx, extra);
    }

    useEffect(() => {
      redraw();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [strokes]);

    function getPos(e: React.PointerEvent<HTMLCanvasElement>): Point {
      const canvas = canvasRef.current!;
      const rect = canvas.getBoundingClientRect();
      return {
        x: ((e.clientX - rect.left) / rect.width) * canvas.width,
        y: ((e.clientY - rect.top) / rect.height) * canvas.height,
      };
    }

    function handlePointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
      e.currentTarget.setPointerCapture(e.pointerId);
      drawingRef.current = true;
      setRedoStack([]);
      currentStrokeRef.current = {
        tool,
        color: tool === "eraser" ? "#ffffff" : color,
        size: tool === "eraser" ? size * 2.5 : size,
        points: [getPos(e)],
      };
      redraw(currentStrokeRef.current);
    }

    function handlePointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
      if (!drawingRef.current || !currentStrokeRef.current) return;
      currentStrokeRef.current.points.push(getPos(e));
      redraw(currentStrokeRef.current);
    }

    function commitStroke() {
      if (!drawingRef.current || !currentStrokeRef.current) return;
      drawingRef.current = false;
      const finished = currentStrokeRef.current;
      currentStrokeRef.current = null;
      setStrokes((prev) => [...prev, finished]);
    }

    function handleUndo() {
      setStrokes((prev) => {
        if (prev.length === 0) return prev;
        setRedoStack((r) => [...r, prev[prev.length - 1]]);
        return prev.slice(0, -1);
      });
    }
    function handleRedo() {
      setRedoStack((prev) => {
        if (prev.length === 0) return prev;
        const last = prev[prev.length - 1];
        setStrokes((s) => [...s, last]);
        return prev.slice(0, -1);
      });
    }
    function handleClear() {
      setStrokes([]);
      setRedoStack([]);
    }

    useEffect(() => {
      function isTypingInField() {
        const el = document.activeElement;
        const tag = el?.tagName;
        return tag === "INPUT" || tag === "TEXTAREA" || (el as HTMLElement)?.isContentEditable;
      }

      function handleKeyDown(e: KeyboardEvent) {
        const meta = e.ctrlKey || e.metaKey;
        if (!meta || e.key.toLowerCase() !== "z" || isTypingInField()) return;
        e.preventDefault();
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      }

      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    useImperativeHandle(ref, () => ({
      getDataUrl: () => canvasRef.current?.toDataURL("image/png") ?? null,
      isEmpty: () => strokes.length === 0,
      clear: handleClear,
    }));

    return (
      <div className={cn("flex flex-col gap-2", className)}>
        <div className="flex flex-wrap items-center gap-3 border border-(--color-paper-line) bg-white p-2">
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => setTool("pen")}
              aria-label="Pen"
              aria-pressed={tool === "pen"}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded border",
                tool === "pen"
                  ? "border-(--color-ink) bg-(--color-ink) text-(--color-paper)"
                  : "border-(--color-paper-line) text-(--color-ink-soft)"
              )}
            >
              <Pencil size={15} />
            </button>
            <button
              type="button"
              onClick={() => setTool("eraser")}
              aria-label="Eraser"
              aria-pressed={tool === "eraser"}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded border",
                tool === "eraser"
                  ? "border-(--color-ink) bg-(--color-ink) text-(--color-paper)"
                  : "border-(--color-paper-line) text-(--color-ink-soft)"
              )}
            >
              <Eraser size={15} />
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            {COLORS.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  setColor(c.hex);
                  setTool("pen");
                }}
                aria-label={c.id}
                className={cn(
                  "h-6 w-6 rounded-full border-2",
                  tool === "pen" && color === c.hex ? "border-(--color-ink)" : "border-transparent"
                )}
                style={{ backgroundColor: c.hex }}
              />
            ))}

            {/* Full color picker for anything beyond the presets — the
                swatch itself shows the currently picked custom color. */}
            <label
              className="relative flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-dashed border-(--color-ink-faint)"
              style={
                !COLORS.some((c) => c.hex === color) ? { borderStyle: "solid", borderColor: "var(--color-ink)" } : undefined
              }
              title="Pick any color"
            >
              <span
                className="h-4 w-4 rounded-full"
                style={{
                  background: !COLORS.some((c) => c.hex === color)
                    ? color
                    : "conic-gradient(red, yellow, lime, cyan, blue, magenta, red)",
                }}
                aria-hidden
              />
              <input
                type="color"
                value={color}
                onChange={(e) => {
                  setColor(e.target.value);
                  setTool("pen");
                }}
                aria-label="Pick a custom color"
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              />
            </label>
          </div>

          <div className="flex items-center gap-1.5">
            {SIZES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSize(s)}
                aria-label={`Brush size ${s}`}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded border",
                  size === s ? "border-(--color-ink)" : "border-(--color-paper-line)"
                )}
              >
                <span
                  className="rounded-full bg-(--color-ink-soft)"
                  style={{ width: s, height: s }}
                />
              </button>
            ))}
          </div>

          <div className="ml-auto flex gap-1.5">
            <button
              type="button"
              onClick={handleUndo}
              disabled={strokes.length === 0}
              aria-label="Undo"
              className="flex h-8 w-8 items-center justify-center rounded border border-(--color-paper-line) text-(--color-ink-soft) disabled:opacity-30"
            >
              <Undo2 size={15} />
            </button>
            <button
              type="button"
              onClick={handleRedo}
              disabled={redoStack.length === 0}
              aria-label="Redo"
              className="flex h-8 w-8 items-center justify-center rounded border border-(--color-paper-line) text-(--color-ink-soft) disabled:opacity-30"
            >
              <Redo2 size={15} />
            </button>
            <button
              type="button"
              onClick={handleClear}
              disabled={strokes.length === 0}
              aria-label="Clear"
              className="flex h-8 w-8 items-center justify-center rounded border border-(--color-paper-line) text-(--color-stamp-red) disabled:opacity-30"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>

        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={commitStroke}
          onPointerLeave={commitStroke}
          onPointerCancel={commitStroke}
          className="w-full touch-none border border-(--color-paper-line) bg-white"
          style={{ aspectRatio: `${width} / ${height}` }}
        />
      </div>
    );
  }
);
