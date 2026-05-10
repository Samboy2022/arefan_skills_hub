import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Clock } from 'lucide-react'

export default function ChangelogPage() {
  const changelogData = [
    {
      version: "v2.1.0",
      date: "October 15, 2024",
      tag: "Major Update",
      tagColor: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      changes: [
        { type: "Added", text: "Complete overhaul of the reporting and analytics dashboard for School Admins." },
        { type: "Added", text: "Native Zoom integration now supports recurring meetings and automated attendance tracking." },
        { type: "Improved", text: "Student submission interface now supports bulk file uploads and drag-and-drop." },
        { type: "Fixed", text: "Resolved an issue where email notifications for password resets were delayed." }
      ]
    },
    {
      version: "v2.0.5",
      date: "September 02, 2024",
      tag: "Patch",
      tagColor: "bg-green-500/10 text-green-500 border-green-500/20",
      changes: [
        { type: "Improved", text: "Optimized video playback speeds for regions with low bandwidth." },
        { type: "Fixed", text: "Fixed timezone synchronization issue in the calendar widget." },
        { type: "Fixed", text: "UI adjustments for mobile responsiveness on the Instructor grading page." }
      ]
    },
    {
      version: "v2.0.0",
      date: "August 10, 2024",
      tag: "Major Release",
      tagColor: "bg-purple-500/10 text-purple-500 border-purple-500/20",
      changes: [
        { type: "Added", text: "Launch of the Multi-Tenant Architecture allowing custom sub-domains." },
        { type: "Added", text: "Dark mode implementation across all dashboards (Admin, Instructor, Student)." },
        { type: "Added", text: "New granular Role-Based Access Control (RBAC) system." },
        { type: "Improved", text: "Complete UI/UX redesign of the main landing page and authentication flow." }
      ]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <SiteHeader />

      <main className="flex-1 pb-24">
        {/* Header Section */}
        <section className="py-24 md:py-32 bg-gradient-to-b from-background to-muted/30 border-b border-border text-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
              Product <span className="text-primary text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-400">Changelog</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-10">
              Keep track of the latest updates, improvements, and fixes across the FnSkills platform.
            </p>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <div className="relative border-l border-border/50 pl-8 md:pl-12 ml-4 md:ml-0 space-y-16">

              {changelogData.map((release, index) => (
                <div key={index} className="relative">
                  {/* Timeline Dot */}
                  <div className="absolute -left-[41px] md:-left-[57px] top-1 h-5 w-5 rounded-full border-4 border-background bg-primary shadow-sm"></div>

                  {/* Content Header */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-2">
                    <div className="flex items-center gap-3">
                      <h2 className="text-2xl font-bold">{release.version}</h2>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${release.tagColor}`}>
                        {release.tag}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-2" />
                      <time>{release.date}</time>
                    </div>
                  </div>

                  {/* Changes List */}
                  <div className="bg-card border border-border/50 rounded-xl p-6 shadow-sm">
                    <ul className="space-y-4">
                      {release.changes.map((change, i) => {
                        let badgeColor = "";
                        switch(change.type) {
                          case "Added": badgeColor = "bg-green-500/10 text-green-500 border-green-500/20"; break;
                          case "Improved": badgeColor = "bg-blue-500/10 text-blue-500 border-blue-500/20"; break;
                          case "Fixed": badgeColor = "bg-orange-500/10 text-orange-500 border-orange-500/20"; break;
                          default: badgeColor = "bg-muted text-muted-foreground border-border";
                        }

                        return (
                          <li key={i} className="flex flex-col sm:flex-row sm:items-start gap-3">
                            <span className={`px-2 py-0.5 rounded text-xs font-medium border w-fit flex-shrink-0 mt-0.5 ${badgeColor}`}>
                              {change.type}
                            </span>
                            <span className="text-muted-foreground">{change.text}</span>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                </div>
              ))}

            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
