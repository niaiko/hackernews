import type React from "react"
import {
  ChevronRight,
  ExternalLink,
  Github,
  Menu,
  Moon,
  Sun,
  Users,
  Upload,
  Loader2,
  LogOut,
  Settings,
  User,
  FileEdit,
  Bookmark,
  Heart,
  Clock,
  Search,
  Trash,
  X,
  Check,
  ThumbsUp,
  MessageCircle
} from "lucide-react"

type IconProps = React.HTMLAttributes<SVGElement>

export const Icons = {
  logo: ({ ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 2 2 7l10 5 10-5-10-5Z"></path>
      <path d="M2 17 12 22 22 17"></path>
      <path d="M2 12 12 17 22 12"></path>
    </svg>
  ),
  chevronRight: ChevronRight,
  externalLink: ExternalLink,
  gitHub: Github,
  menu: Menu,
  moon: Moon,
  sun: Sun,
  users: Users,
  upload: Upload,
  spinner: Loader2,
  logout: LogOut,
  settings: Settings,
  user: User,
  edit: FileEdit,
  bookmark: Bookmark,
  heart: Heart,
  clock: Clock,
  search: Search,
  trash: Trash,
  close: X,
  check: Check,
  upvote: ThumbsUp,
  messageCircle: MessageCircle
}

export type Icon = keyof typeof Icons

