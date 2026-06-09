import {
  LayoutDashboard,
  FileSearch,
  FilePlus,
  Target,
  FileText,
  Building2,
  Briefcase,
  TrendingUp,
  FolderOpen,
  Wallet,
  MessageSquareHeart,
  Coins,
  Receipt,
  Settings,
  LifeBuoy,
  type LucideIcon,
} from "lucide-react";

export type MenuItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

// Single source of truth for the dashboard navigation. Rendered by both the
// desktop Sidebar (`hidden lg:flex`) and the mobile drawer inside Navbar, so
// adding/removing an entry here keeps both breakpoints in sync automatically.
export const MENU_ITEMS: MenuItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Análise de Currículo", href: "/resume-analysis", icon: FileSearch },
  { label: "Criar Currículo", href: "/create-resume", icon: FilePlus },
  { label: "Adaptar para Vaga", href: "/adapt-resume", icon: Target },
  { label: "Carta de Apresentação", href: "/cover-letter", icon: FileText },
  { label: "Análise de Empresa", href: "/company-analysis", icon: Building2 },
  { label: "Vagas", href: "/jobs", icon: Briefcase },
  { label: "Mercado", href: "/market", icon: TrendingUp },
  { label: "Meus Arquivos", href: "/my-files", icon: FolderOpen },
  { label: "Carteira", href: "/carteira", icon: Wallet },
  { label: "Nos ajude a melhorar", href: "/feedback", icon: MessageSquareHeart },
];

// Secondary items pinned below the feature list (billing, settings, support).
export const MENU_BOTTOM_ITEMS: MenuItem[] = [
  { label: "Pacotes", href: "/plans#pacotes", icon: Coins },
  { label: "Compras", href: "/compras", icon: Receipt },
  { label: "Configurações", href: "/profile", icon: Settings },
  { label: "Suporte", href: "/support", icon: LifeBuoy },
];
