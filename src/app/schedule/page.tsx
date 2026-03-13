import { Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Calendar, Clock } from 'lucide-react'
import { getSchedule } from '@/lib/api'
import { BottomNav } from '@/components/bottom-nav'
import { Spinner } from '@/components/ui/spinner'
import { cn } from '@/lib/utils'

const dayOrder = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu', 'Random']

function getTodayDay(): string {
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
  const today = new Date()
  return days[today.getDay()]
}

async function ScheduleContent() {
  const scheduleData = await getSchedule()
  const today = getTodayDay()
  
  // Sort with today first
  const sortedSchedule = [...scheduleData].sort((a, b) => {
    // Today comes first
    if (a.day === today) return -1
    if (b.day === today) return 1
    // Then sort by day order
    return dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day)
  })

  return (
    <>
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border/50">
        <div className="flex items-center gap-3 h-14 px-4">
          <Link 
            href="/"
            className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </Link>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            <h1 className="text-lg font-bold text-foreground">Jadwal Rilis</h1>
          </div>
          <div className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="w-3.5 h-3.5" />
            <span>{today}</span>
          </div>
        </div>
      </header>

      <div className="px-4 py-4 pb-24 space-y-6">
        {sortedSchedule.map((day) => {
          const isToday = day.day === today
          
          return (
            <section key={day.day}>
              <h2 className={cn(
                "text-sm font-bold mb-3 flex items-center gap-2",
                isToday ? "text-primary" : "text-foreground"
              )}>
                <div className={cn(
                  "w-1 h-4 rounded-full",
                  isToday ? "bg-primary" : "bg-muted-foreground"
                )} />
                {day.day}
                {isToday && (
                  <span className="px-2 py-0.5 bg-primary/20 text-primary text-[10px] font-medium rounded-full">
                    HARI INI
                  </span>
                )}
              </h2>
              
              {day.anime_list.length > 0 ? (
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {day.anime_list.map((anime, index) => (
                    <Link
                      key={`${anime.slug}-${index}`}
                      href={`/anime/${anime.slug}`}
                      className="group"
                    >
                      <div className={cn(
                        "relative aspect-[3/4] rounded-lg overflow-hidden bg-muted",
                        isToday && "ring-1 ring-primary/30"
                      )}>
                        <Image
                          src={anime.poster}
                          alt={anime.title || anime.slug}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 640px) 33vw, (max-width: 1024px) 25vw, 16vw"
                        />
                      </div>
                      <h3 className="mt-1.5 text-xs font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                        {anime.title || anime.slug}
                      </h3>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Tidak ada anime untuk hari ini</p>
              )}
            </section>
          )
        })}
      </div>
    </>
  )
}

function LoadingState() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Spinner className="w-8 h-8 text-primary" />
    </div>
  )
}

export default function SchedulePage() {
  return (
    <main className="min-h-screen bg-background">
      <Suspense fallback={<LoadingState />}>
        <ScheduleContent />
      </Suspense>
      <BottomNav />
    </main>
  )
            }
                        
