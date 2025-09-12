'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Home,
  Dumbbell,
  Plus,
  BarChart3,
  Settings,
  User,
  LogOut,
  ChevronUp,
  Calendar,
  Calculator,
  Shield,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

// Função para obter itens de navegação baseado no papel do usuário
const getNavigationItems = (isAdmin: boolean) => {
  if (isAdmin) {
    // Personal Trainers (admins) - acesso completo
    return [
      {
        title: "Dashboard",
        items: [
          {
            title: "Visão Geral",
            url: "/",
            icon: Home,
          },
          {
            title: "Estatísticas",
            url: "/stats",
            icon: BarChart3,
          },
        ],
      },
      {
        title: "Treinos",
        items: [
          {
            title: "Meus Treinos",
            url: "/workouts",
            icon: Dumbbell,
          },
          {
            title: "Criar Treino",
            url: "/workouts/create",
            icon: Plus,
          },
          {
            title: "Calculadoras",
            url: "/calculators",
            icon: Calculator,
          },
        ],
      },
      {
        title: "Exercícios",
        items: [
          {
            title: "Biblioteca",
            url: "/exercises",
            icon: Calendar,
          },
          {
            title: "Criar Exercício",
            url: "/exercises/create",
            icon: Plus,
          },
        ],
      },
      {
        title: "Administração",
        items: [
          {
            title: "Painel Personal",
            url: "/admin",
            icon: Shield,
          },
        ],
      },
    ];
  } else {
    // Alunos (users) - acesso limitado
    return [
      {
        title: "Dashboard",
        items: [
          {
            title: "Visão Geral",
            url: "/",
            icon: Home,
          },
          {
            title: "Estatísticas",
            url: "/stats",
            icon: BarChart3,
          },
        ],
      },
      {
        title: "Treinos",
        items: [
          {
            title: "Meus Treinos",
            url: "/workouts",
            icon: Dumbbell,
          },
          {
            title: "Calculadoras",
            url: "/calculators",
            icon: Calculator,
          },
        ],
      },
    ];
  }
};

export function AppSidebar() {
  const pathname = usePathname();
  const { user, profile } = useAuth();
  
  // Determina se o usuário é admin
  const isAdmin = profile?.role === 'admin' || false;
  
  // Obtém os itens de navegação baseado no status de admin
  const navigationItems = getNavigationItems(isAdmin);
  
  // Dados do usuário para exibição
  const displayUser = {
    name: profile?.displayName || user?.username || 'Usuário',
    email: profile?.email || 'usuario@exemplo.com',
    avatar: '/avatars/01.png',
  };

  return (
    <Sidebar variant="inset" className="overflow-hidden">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Dumbbell className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Gym Dashboard</span>
                  <span className="truncate text-xs">Criador de Treinos</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="overflow-y-auto scrollbar-hide">
        {navigationItems.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = pathname === item.url;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        className={cn(
                          "transition-colors",
                          isActive && "bg-primary/10 text-primary font-medium"
                        )}
                      >
                        <Link href={item.url}>
                          <item.icon className="size-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={displayUser.avatar} alt={displayUser.name} />
                    <AvatarFallback className="rounded-lg">
                      {displayUser.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{displayUser.name}</span>
                    <span className="truncate text-xs">{displayUser.email}</span>
                  </div>
                  <ChevronUp className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Meu Perfil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    Configurações
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}