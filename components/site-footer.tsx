import Link from 'next/link'
import Image from 'next/image'

export function SiteFooter() {
  return (
    <footer className="bg-slate-950 text-slate-300 py-16 border-t border-slate-900 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <Link href="/">
              <Image src="/fnskillslogo11.png" alt="FnSkills Logo" width={140} height={40} className="h-8 w-auto mb-6" />
            </Link>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
              Empowering institutions with cloud-based, multi-tenant learning infrastructure.
            </p>
            <div className="flex gap-4">
              <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary transition-colors cursor-pointer">
                <span className="sr-only">Twitter</span>
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
              </div>
              <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary transition-colors cursor-pointer">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </div>
            </div>
          </div>

          <div className="col-span-1">
            <h3 className="text-white font-semibold mb-4 tracking-wide">Product</h3>
            <ul className="space-y-3">
              <li><Link href="/features" className="text-slate-400 hover:text-white transition-colors">Features</Link></li>
              <li><Link href="/pricing" className="text-slate-400 hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="/integrations" className="text-slate-400 hover:text-white transition-colors">Integrations</Link></li>
              <li><Link href="/changelog" className="text-slate-400 hover:text-white transition-colors">Changelog</Link></li>
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="text-white font-semibold mb-4 tracking-wide">Resources</h3>
            <ul className="space-y-3">
              <li><Link href="/documentation" className="text-slate-400 hover:text-white transition-colors">Documentation</Link></li>
              <li><Link href="/help-center" className="text-slate-400 hover:text-white transition-colors">Help Center</Link></li>
              <li><Link href="/community" className="text-slate-400 hover:text-white transition-colors">Community</Link></li>
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="text-white font-semibold mb-4 tracking-wide">Company</h3>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-slate-400 hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/careers" className="text-slate-400 hover:text-white transition-colors">Careers</Link></li>
              <li><Link href="/privacy" className="text-slate-400 hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-slate-400 hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} FnSkills. All rights reserved.
          </p>
          <div className="flex gap-4">
            <span className="text-sm text-slate-500 flex items-center"><span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span> System Status: Operational</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
