import { Cpu, Github, Twitter, Mail } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer id="about" className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent">
                <Cpu className="h-5 w-5 text-accent-foreground" />
              </div>
              <span className="text-xl font-bold tracking-tight">AI Games</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              An interactive educational platform for learning artificial intelligence concepts through games and
              puzzles.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Quick Links</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <a href="#games" className="text-sm text-foreground/80 transition-colors hover:text-accent">
                  Games
                </a>
              </li>
              <li>
                <a href="#theory" className="text-sm text-foreground/80 transition-colors hover:text-accent">
                  Theory
                </a>
              </li>
              <li>
                <a href="#about" className="text-sm text-foreground/80 transition-colors hover:text-accent">
                  About
                </a>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Connect</h3>
            <div className="mt-4 flex gap-4">
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 border-t border-border pt-8">
          <p className="text-center text-sm text-muted-foreground">
            Built with care for learning. AI Games - Personal Educational Project.
          </p>
        </div>
      </div>
    </footer>
  )
}
