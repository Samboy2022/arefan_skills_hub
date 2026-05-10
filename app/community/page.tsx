import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { MessageCircle, Mail, Users, ExternalLink } from 'lucide-react'

export default function CommunityPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <SiteHeader />

      <main className="flex-1 pb-24">
        {/* Header Section */}
        <section className="py-24 bg-gradient-to-b from-background to-muted/30 border-b border-border text-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
              Join the <span className="text-primary text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-400">FnSkills Community</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-10">
              Connect with fellow educators, administrators, and developers. Share resources, ask questions, and help shape the future of learning.
            </p>
          </div>
        </section>

        {/* Community Channels */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            <div className="grid md:grid-cols-2 gap-8">

              {/* WhatsApp */}
              <div className="bg-card border border-border rounded-2xl p-8 hover:shadow-lg transition-all hover:border-green-500/50 group">
                <div className="h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center mb-6 text-green-500 group-hover:bg-green-500 group-hover:text-white transition-colors">
                  <MessageCircle className="h-8 w-8" />
                </div>
                <h2 className="text-2xl font-bold mb-3">WhatsApp Channels</h2>
                <p className="text-muted-foreground mb-6">
                  Get real-time announcements, quick tips, and direct access to our core team. We have dedicated channels for Instructors and School Admins.
                </p>
                <a href="#" className="inline-flex items-center text-green-500 font-medium hover:underline">
                  Join WhatsApp Channel <ExternalLink className="h-4 w-4 ml-1" />
                </a>
              </div>

              {/* Telegram */}
              <div className="bg-card border border-border rounded-2xl p-8 hover:shadow-lg transition-all hover:border-blue-500/50 group">
                <div className="h-16 w-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-6 text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                  <MessageCircle className="h-8 w-8" />
                </div>
                <h2 className="text-2xl font-bold mb-3">Telegram Group</h2>
                <p className="text-muted-foreground mb-6">
                  Our largest and most active community space. Engage in deep discussions about e-learning strategies, feature requests, and technical integrations.
                </p>
                <a href="#" className="inline-flex items-center text-blue-500 font-medium hover:underline">
                  Join Telegram Group <ExternalLink className="h-4 w-4 ml-1" />
                </a>
              </div>

              {/* Facebook */}
              <div className="bg-card border border-border rounded-2xl p-8 hover:shadow-lg transition-all hover:border-indigo-500/50 group">
                <div className="h-16 w-16 rounded-full bg-indigo-500/10 flex items-center justify-center mb-6 text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                  <Users className="h-8 w-8" />
                </div>
                <h2 className="text-2xl font-bold mb-3">Facebook Group</h2>
                <p className="text-muted-foreground mb-6">
                  Join our official Facebook community to network with other institutional leaders. We regularly host live Q&A sessions and feature highlights here.
                </p>
                <a href="#" className="inline-flex items-center text-indigo-500 font-medium hover:underline">
                  Join Facebook Group <ExternalLink className="h-4 w-4 ml-1" />
                </a>
              </div>

              {/* Newsletter */}
              <div className="bg-primary text-primary-foreground rounded-2xl p-8 shadow-lg relative overflow-hidden">
                <div className="absolute -right-10 -top-10 h-40 w-40 bg-white/10 rounded-full blur-2xl"></div>
                <div className="relative z-10">
                  <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center mb-6 text-white">
                    <Mail className="h-8 w-8" />
                  </div>
                  <h2 className="text-2xl font-bold mb-3">Weekly Newsletter</h2>
                  <p className="text-primary-foreground/90 mb-6">
                    Curated content delivered straight to your inbox. Get the latest LMS trends, platform updates, and exclusive webinar invites.
                  </p>
                  <form className="flex gap-2">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                    />
                    <button type="submit" className="bg-white text-primary px-4 py-2 rounded-lg font-medium hover:bg-white/90 transition-colors">
                      Subscribe
                    </button>
                  </form>
                </div>
              </div>

            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
