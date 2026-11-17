"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, ChevronLeft, ChevronRight, PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { FORMAT_LABELS, LibraryItem, coverToneFor, lengthLabel } from "@/lib/library";
import { BookCover } from "@/components/library/book-cover";
import { RatingStars } from "@/components/library/book-card";

/** Auto-advancing slider of featured titles at the top of the library. */
export function LibraryHero({ items, basePath }: { items: LibraryItem[]; basePath: string }) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    onSelect();
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  useEffect(() => {
    if (!api || paused || items.length < 2) return;
    const timer = window.setInterval(() => api.scrollNext(), 6500);
    return () => window.clearInterval(timer);
  }, [api, paused, items.length]);

  if (items.length === 0) return null;

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <Carousel setApi={setApi} opts={{ loop: true }} className="overflow-hidden rounded-2xl">
        <CarouselContent className="-ml-0">
          {items.map((item) => {
            const tone = coverToneFor(item);
            const isVideo = item.format === "video";
            const isAudio = item.format === "audio";
            return (
              <CarouselItem key={item.id} className="pl-0">
                <div className={cn("relative overflow-hidden rounded-2xl", tone.face)}>
                  {/* Soft texture so the banner reads as a display, not a flat block. */}
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.18),transparent_55%)]" />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/45 via-black/20 to-transparent" />
                  <div className="relative grid items-center gap-6 px-6 py-8 sm:px-10 sm:py-10 md:grid-cols-[minmax(0,1fr)_220px] lg:grid-cols-[minmax(0,1fr)_260px] lg:px-14">
                    <div className="max-w-xl text-white">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-white/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest backdrop-blur-sm">
                          Featured
                        </span>
                        <span className="text-xs font-medium text-white/80">
                          {FORMAT_LABELS[item.format]} · {item.subject}
                        </span>
                      </div>
                      <h2 className="mt-4 font-serif text-3xl font-bold leading-tight sm:text-4xl">{item.title}</h2>
                      <p className="mt-2 text-sm text-white/85">
                        by <span className="font-semibold text-white">{item.author}</span> · {item.year} · {lengthLabel(item)}
                      </p>
                      <RatingStars
                        rating={item.rating}
                        count={item.ratingCount}
                        className="mt-3 [&_span]:text-white/90 [&>span:nth-child(2)]:text-white"
                      />
                      <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-white/85 sm:text-base">{item.description}</p>
                      <div className="mt-6 flex flex-wrap gap-3">
                        <Button asChild size="lg" className="bg-white text-stone-900 hover:bg-white/90">
                          <Link href={`${basePath}/${item.id}?read=1`}>
                            {isVideo ? <PlayCircle className="mr-2 h-4 w-4" /> : <BookOpen className="mr-2 h-4 w-4" />}
                            {isVideo ? "Watch now" : isAudio ? "Listen" : "Start reading"}
                          </Link>
                        </Button>
                        <Button
                          asChild
                          size="lg"
                          variant="outline"
                          className="border-white/40 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 hover:text-white"
                        >
                          <Link href={`${basePath}/${item.id}`}>View details</Link>
                        </Button>
                      </div>
                    </div>
                    <div className="hidden justify-center md:flex">
                      <Link href={`${basePath}/${item.id}`} className="w-[180px] -rotate-3 transition-transform duration-500 hover:rotate-0 lg:w-[210px]">
                        <BookCover item={item} size="lg" showBadge={false} className="ring-1 ring-white/20" />
                      </Link>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>

      {items.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => api?.scrollPrev()}
            aria-label="Previous featured title"
            className="absolute left-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition hover:bg-black/50 sm:flex"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => api?.scrollNext()}
            aria-label="Next featured title"
            className="absolute right-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition hover:bg-black/50 sm:flex"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
            {items.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => api?.scrollTo(index)}
                aria-label={`Show ${item.title}`}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  index === current ? "w-6 bg-white" : "w-1.5 bg-white/50 hover:bg-white/80",
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
