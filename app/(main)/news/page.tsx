import AnimatedSection from "@/components/shared/AnimatedSection";
import prisma from "@/lib/prisma";

export const metadata = { title: "News" };

async function getPosts() {
  try {
    return await prisma.content_Post.findMany({
      where: { published: true, tags: { has: "news" } },
      orderBy: { createdAt: "desc" },
    });
  } catch { return []; }
}

export default async function NewsPage() {
  const posts = await getPosts();

  return (
    <div className="min-h-screen bg-black pt-20">
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <span className="text-xs font-semibold text-[#c9a84c] uppercase tracking-widest">Latest</span>
            <h1 className="text-5xl sm:text-7xl font-black mt-2 mb-4">News</h1>
            <p className="text-white/40 text-lg max-w-xl">
              Stories, updates, and insights from the PiChess community.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-4 px-4 pb-24">
        <div className="max-w-7xl mx-auto">
          {posts.length === 0 ? (
            <AnimatedSection>
              <div className="rounded-xl border border-white/10 bg-zinc-900 p-16 text-center text-white/30">
                No news articles yet.
              </div>
            </AnimatedSection>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((p, i) => (
                <AnimatedSection key={p.id} delay={i * 0.1}>
                  <article className="group rounded-xl border border-white/10 bg-zinc-900 overflow-hidden hover-lift">
                    {p.image && (
                      <div className="aspect-video bg-zinc-800 overflow-hidden">
                        <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                    )}
                    {!p.image && (
                      <div className="aspect-video bg-zinc-800 flex items-center justify-center text-5xl opacity-20">♟</div>
                    )}
                    <div className="p-5">
                      <div className="flex gap-2 flex-wrap mb-2">
                        {p.tags.map((tag) => (
                          <span key={tag} className="text-[10px] text-white/30 border border-white/10 px-2 py-0.5 rounded-full capitalize">{tag}</span>
                        ))}
                      </div>
                      <h3 className="font-bold text-white text-lg mb-2 leading-snug group-hover:text-[#c9a84c] transition-colors">{p.title}</h3>
                      {p.excerpt && <p className="text-white/40 text-sm line-clamp-2">{p.excerpt}</p>}
                      <p className="text-white/20 text-xs mt-3">
                        {new Date(p.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                      </p>
                    </div>
                  </article>
                </AnimatedSection>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
