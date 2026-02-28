"use client";

import { useState, useRef, useCallback, useTransition } from "react";

/* ────────────────────────────────────────────────────────
   Types
   ──────────────────────────────────────────────────────── */

interface Tournament {
  id: number;
  title: string;
  description: string | null;
  date: string;
  endDate: string | null;
  location: string;
  venue: string | null;
  flyer: string | null;
  registrationLink: string | null;
  type: string;
  tags: string[];
  status: string;
  featured: boolean;
  photos: Photo[];
}

interface Photo {
  id: number;
  url: string;
  caption: string | null;
}

interface Props {
  tournaments: Tournament[];
  createAction: (fd: FormData) => Promise<void>;
  updateAction: (fd: FormData) => Promise<void>;
  deleteAction: (fd: FormData) => Promise<void>;
  addPhotoAction: (fd: FormData) => Promise<void>;
  deletePhotoAction: (fd: FormData) => Promise<void>;
}

/* ────────────────────────────────────────────────────────
   Styling
   ──────────────────────────────────────────────────────── */

const inputCls =
  "w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400/40 outline-none transition-all placeholder:text-zinc-300";
const labelCls = "text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-1.5 block";

const statusColors: Record<string, string> = {
  UPCOMING: "bg-blue-50 text-blue-600",
  ONGOING: "bg-green-50 text-green-600",
  COMPLETED: "bg-zinc-100 text-zinc-500",
};

const typeColors: Record<string, string> = {
  TOURNAMENT: "bg-amber-50 text-amber-700",
  EVENT: "bg-purple-50 text-purple-700",
};

/* ────────────────────────────────────────────────────────
   Image Upload Component
   ──────────────────────────────────────────────────────── */

function ImageUpload({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const upload = useCallback(
    async (file: File) => {
      setUploading(true);
      try {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (data.url) onChange(data.url);
        else alert(data.error || "Upload failed");
      } catch {
        alert("Upload failed");
      } finally {
        setUploading(false);
      }
    },
    [onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files?.[0];
      if (file && file.type.startsWith("image/")) upload(file);
    },
    [upload]
  );

  return (
    <div>
      <label className={labelCls}>{label}</label>
      <div className="flex gap-2 mb-2">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={inputCls}
          placeholder="https://... or upload"
        />
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) upload(f);
            e.target.value = "";
          }}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="shrink-0 px-3 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-600 text-xs font-semibold transition-all disabled:opacity-50 border border-zinc-200"
        >
          {uploading ? "..." : "📁"}
        </button>
      </div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`relative rounded-xl border-2 border-dashed transition-all overflow-hidden ${
          dragOver ? "border-amber-400 bg-amber-400/5" : value ? "border-zinc-200 bg-zinc-50" : "border-zinc-200 bg-zinc-50"
        } ${value ? "h-32" : "h-20"}`}
      >
        {value ? (
          <>
            <img src={value} alt="preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <button type="button" onClick={() => fileRef.current?.click()} className="px-3 py-1.5 rounded-lg bg-white/90 text-zinc-700 text-xs font-semibold hover:bg-white">Replace</button>
              <button type="button" onClick={() => onChange("")} className="px-3 py-1.5 rounded-lg bg-red-500/90 text-white text-xs font-semibold hover:bg-red-500">Remove</button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-zinc-400">
            <span className="text-xl mb-0.5">📷</span>
            <span className="text-[11px] font-medium">{uploading ? "Uploading…" : "Drop image or click 📁"}</span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────
   Create / Edit Form Modal
   ──────────────────────────────────────────────────────── */

function TournamentForm({
  initial,
  onSubmit,
  onClose,
  isPending,
}: {
  initial?: Tournament;
  onSubmit: (fd: FormData) => void;
  onClose: () => void;
  isPending: boolean;
}) {
  const isEdit = !!initial;
  const [flyer, setFlyer] = useState(initial?.flyer ?? "");
  const [type, setType] = useState(initial?.type ?? "TOURNAMENT");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl border border-zinc-200/80"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 bg-white border-b border-zinc-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-lg font-bold text-zinc-800">
            {isEdit ? `Edit: ${initial.title}` : "Create New Tournament / Event"}
          </h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-500 hover:bg-zinc-200 transition-colors text-sm">
            ✕
          </button>
        </div>

        <form
          action={(fd) => {
            fd.set("flyer", flyer);
            fd.set("type", type);
            if (initial) fd.set("id", String(initial.id));
            onSubmit(fd);
          }}
          className="p-6 space-y-4"
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="col-span-full">
              <label className={labelCls}>Title *</label>
              <input name="title" required defaultValue={initial?.title} className={inputCls} placeholder="PiChess Academy Juniors Cup" />
            </div>

            <div>
              <label className={labelCls}>Type</label>
              <select value={type} onChange={(e) => setType(e.target.value)} className={inputCls}>
                <option value="TOURNAMENT">🏆 Tournament</option>
                <option value="EVENT">🎪 Event</option>
              </select>
            </div>

            <div>
              <label className={labelCls}>Status</label>
              <select name="status" defaultValue={initial?.status ?? "UPCOMING"} className={inputCls}>
                <option value="UPCOMING">Upcoming</option>
                <option value="ONGOING">Ongoing / Live</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>

            <div>
              <label className={labelCls}>Start Date *</label>
              <input name="date" type="date" required defaultValue={initial?.date ? new Date(initial.date).toISOString().split("T")[0] : ""} className={inputCls} />
            </div>

            <div>
              <label className={labelCls}>End Date (optional)</label>
              <input name="endDate" type="date" defaultValue={initial?.endDate ? new Date(initial.endDate).toISOString().split("T")[0] : ""} className={inputCls} />
            </div>

            <div>
              <label className={labelCls}>Location *</label>
              <input name="location" required defaultValue={initial?.location} className={inputCls} placeholder="Kumasi, Ghana" />
            </div>

            <div>
              <label className={labelCls}>Venue</label>
              <input name="venue" defaultValue={initial?.venue ?? ""} className={inputCls} placeholder="PiChess Academy Hall" />
            </div>

            <div className="col-span-full">
              <label className={labelCls}>Description</label>
              <textarea name="description" rows={3} defaultValue={initial?.description ?? ""} className={`${inputCls} resize-none`} placeholder="Tell people about this tournament or event..." />
            </div>

            <div>
              <label className={labelCls}>Registration URL</label>
              <input name="registrationLink" defaultValue={initial?.registrationLink ?? ""} className={inputCls} placeholder="https://forms.google.com/..." />
            </div>

            <div>
              <label className={labelCls}>Tags (comma-separated)</label>
              <input name="tags" defaultValue={(initial?.tags ?? []).join(", ")} className={inputCls} placeholder="academy, open, ngo" />
            </div>

            <div className="col-span-full">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="featured" value="true" defaultChecked={initial?.featured} className="rounded border-zinc-300 text-amber-500 focus:ring-amber-400" />
                <span className="text-sm font-semibold text-zinc-600">⭐ Featured</span>
              </label>
            </div>

            <div className="col-span-full">
              <ImageUpload label="Flyer / Poster Image" value={flyer} onChange={setFlyer} />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-zinc-500 hover:bg-zinc-100 transition-colors">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white text-sm font-semibold hover:shadow-lg hover:shadow-amber-500/20 transition-all disabled:opacity-50"
            >
              {isPending ? "Saving…" : isEdit ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────
   Photos Panel
   ──────────────────────────────────────────────────────── */

function PhotosPanel({
  tournament,
  onAddPhoto,
  onDeletePhoto,
  onClose,
  isPending,
}: {
  tournament: Tournament;
  onAddPhoto: (fd: FormData) => void;
  onDeletePhoto: (fd: FormData) => void;
  onClose: () => void;
  isPending: boolean;
}) {
  const [photoUrl, setPhotoUrl] = useState("");
  const [caption, setCaption] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl border border-zinc-200/80" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 z-10 bg-white border-b border-zinc-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div>
            <h2 className="text-lg font-bold text-zinc-800">Photos: {tournament.title}</h2>
            <p className="text-xs text-zinc-400">{tournament.photos.length} photos</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-500 hover:bg-zinc-200 transition-colors text-sm">✕</button>
        </div>

        <div className="p-6 space-y-6">
          {/* Add photo */}
          <div className="rounded-xl bg-zinc-50 border border-zinc-200/80 p-4 space-y-3">
            <h3 className="text-sm font-bold text-zinc-700">Add Photo</h3>
            <ImageUpload label="Photo URL" value={photoUrl} onChange={setPhotoUrl} />
            <div>
              <label className={labelCls}>Caption (optional)</label>
              <input value={caption} onChange={(e) => setCaption(e.target.value)} className={inputCls} placeholder="Round 3, Finals match" />
            </div>
            <button
              type="button"
              disabled={!photoUrl || isPending}
              onClick={() => {
                const fd = new FormData();
                fd.set("tournamentId", String(tournament.id));
                fd.set("url", photoUrl);
                fd.set("caption", caption);
                onAddPhoto(fd);
                setPhotoUrl("");
                setCaption("");
              }}
              className="px-4 py-2 rounded-xl bg-zinc-800 text-white text-xs font-semibold hover:bg-zinc-700 transition-colors disabled:opacity-50"
            >
              {isPending ? "Adding…" : "Add Photo"}
            </button>
          </div>

          {/* Gallery */}
          {tournament.photos.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {tournament.photos.map((p) => (
                <div key={p.id} className="group relative aspect-[4/3] rounded-xl overflow-hidden border border-zinc-200/80">
                  <img src={p.url} alt={p.caption || ""} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                    {p.caption && <p className="text-white text-[11px] font-medium px-2 text-center">{p.caption}</p>}
                    <button
                      type="button"
                      onClick={() => {
                        const fd = new FormData();
                        fd.set("id", String(p.id));
                        onDeletePhoto(fd);
                      }}
                      className="px-3 py-1 rounded-lg bg-red-500 text-white text-[11px] font-semibold hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-zinc-300">
              <span className="text-3xl mb-2 block">📷</span>
              <p className="text-sm">No photos yet. Upload one above!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────
   Main Admin Component
   ──────────────────────────────────────────────────────── */

export default function AdminTournamentManager({
  tournaments,
  createAction,
  updateAction,
  deleteAction,
  addPhotoAction,
  deletePhotoAction,
}: Props) {
  const [isPending, startTransition] = useTransition();
  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState<Tournament | null>(null);
  const [photosFor, setPhotosFor] = useState<Tournament | null>(null);
  const [filter, setFilter] = useState<"all" | "TOURNAMENT" | "EVENT">("all");

  const upcoming = tournaments.filter((t) => t.status === "UPCOMING").length;
  const ongoing = tournaments.filter((t) => t.status === "ONGOING").length;
  const completed = tournaments.filter((t) => t.status === "COMPLETED").length;
  const eventCount = tournaments.filter((t) => t.type === "EVENT").length;
  const tournamentCount = tournaments.filter((t) => t.type === "TOURNAMENT").length;

  const filtered = filter === "all" ? tournaments : tournaments.filter((t) => t.type === filter);

  function handleCreate(fd: FormData) {
    startTransition(async () => {
      await createAction(fd);
      setShowCreate(false);
    });
  }

  function handleUpdate(fd: FormData) {
    startTransition(async () => {
      await updateAction(fd);
      setEditing(null);
    });
  }

  function handleDelete(t: Tournament) {
    if (!confirm(`Delete "${t.title}"? This cannot be undone.`)) return;
    startTransition(async () => {
      const fd = new FormData();
      fd.set("id", String(t.id));
      await deleteAction(fd);
    });
  }

  function handleAddPhoto(fd: FormData) {
    startTransition(async () => {
      await addPhotoAction(fd);
      // Refresh photosFor with updated data would happen on revalidation
    });
  }

  function handleDeletePhoto(fd: FormData) {
    startTransition(async () => {
      await deletePhotoAction(fd);
    });
  }

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 tracking-tight">Tournaments & Events</h1>
          <p className="text-zinc-400 mt-1 text-sm">Create, edit and manage all tournaments and events. Upload flyers and photos.</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white text-sm font-semibold hover:shadow-lg hover:shadow-amber-500/20 transition-all shrink-0"
        >
          + New Tournament / Event
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: "Total", value: tournaments.length, color: "" },
          { label: "Upcoming", value: upcoming, color: "text-blue-600" },
          { label: "Ongoing", value: ongoing, color: "text-green-600" },
          { label: "Tournaments", value: tournamentCount, color: "text-amber-600" },
          { label: "Events", value: eventCount, color: "text-purple-600" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl bg-white border border-zinc-200/80 p-4">
            <p className={`text-2xl font-black ${s.color || "text-zinc-900"}`}>{s.value}</p>
            <p className="text-xs text-zinc-400 mt-1 font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {([
          { id: "all" as const, label: "All", count: tournaments.length },
          { id: "TOURNAMENT" as const, label: "🏆 Tournaments", count: tournamentCount },
          { id: "EVENT" as const, label: "🎪 Events", count: eventCount },
        ]).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              filter === tab.id
                ? "bg-amber-500 text-white shadow-lg shadow-amber-500/20"
                : "bg-white border border-zinc-200/80 text-zinc-500 hover:bg-zinc-50"
            }`}
          >
            {tab.label}
            <span className={`ml-1.5 text-[11px] font-bold px-1.5 py-0.5 rounded-full ${
              filter === tab.id ? "bg-white/20" : "bg-zinc-100"
            }`}>{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Card grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-full rounded-2xl bg-white border border-zinc-200/80 text-center py-16">
            <span className="text-4xl mb-3 block">🏟️</span>
            <p className="text-zinc-400 text-sm">No items to display. Create one above!</p>
          </div>
        ) : filtered.map((t) => (
          <div key={t.id} className="group rounded-2xl bg-white border border-zinc-200/80 overflow-hidden hover:shadow-lg hover:shadow-zinc-200/50 transition-all">
            {/* Flyer image / placeholder */}
            <div className="relative w-full aspect-[16/10] bg-zinc-100 overflow-hidden">
              {t.flyer ? (
                <img src={t.flyer} alt={t.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-zinc-100 to-zinc-200">
                  <span className="text-5xl opacity-30">{t.type === "EVENT" ? "🎪" : "🏆"}</span>
                </div>
              )}
              {/* Badges overlay */}
              <div className="absolute top-2 left-2 flex gap-1.5">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusColors[t.status] ?? "bg-zinc-100 text-zinc-500"}`}>
                  {t.status}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${typeColors[t.type] ?? typeColors.TOURNAMENT}`}>
                  {t.type}
                </span>
              </div>
              {t.featured && (
                <span className="absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">⭐ Featured</span>
              )}
            </div>

            {/* Content */}
            <div className="p-4 space-y-2">
              <h3 className="font-bold text-zinc-800 text-sm leading-tight line-clamp-2">{t.title}</h3>
              <div className="text-xs text-zinc-400 space-y-0.5">
                <p>📅 {new Date(t.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}{t.endDate ? ` – ${new Date(t.endDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}` : ""}</p>
                <p>📍 {t.location}{t.venue ? ` · ${t.venue}` : ""}</p>
              </div>
              {t.tags.length > 0 && (
                <div className="flex gap-1 flex-wrap">
                  {t.tags.map((tag) => (
                    <span key={tag} className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-600">{tag}</span>
                  ))}
                </div>
              )}
              {t.photos.length > 0 && (
                <p className="text-[11px] text-zinc-300">📷 {t.photos.length} photo{t.photos.length !== 1 ? "s" : ""}</p>
              )}

              {/* Actions */}
              <div className="flex gap-1.5 pt-2 border-t border-zinc-100">
                <button onClick={() => setEditing(t)} className="flex-1 px-3 py-1.5 rounded-lg bg-zinc-800 text-white text-[11px] font-semibold hover:bg-zinc-700 transition-colors">
                  Edit
                </button>
                <button onClick={() => setPhotosFor(t)} className="px-3 py-1.5 rounded-lg bg-zinc-100 text-zinc-600 text-[11px] font-semibold hover:bg-zinc-200 transition-colors">
                  📷 Photos
                </button>
                <button onClick={() => handleDelete(t)} className="px-3 py-1.5 rounded-lg bg-red-50 text-red-500 text-[11px] font-semibold hover:bg-red-100 transition-colors">
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      {showCreate && (
        <TournamentForm onSubmit={handleCreate} onClose={() => setShowCreate(false)} isPending={isPending} />
      )}
      {editing && (
        <TournamentForm initial={editing} onSubmit={handleUpdate} onClose={() => setEditing(null)} isPending={isPending} />
      )}
      {photosFor && (
        <PhotosPanel tournament={photosFor} onAddPhoto={handleAddPhoto} onDeletePhoto={handleDeletePhoto} onClose={() => setPhotosFor(null)} isPending={isPending} />
      )}
    </div>
  );
}
