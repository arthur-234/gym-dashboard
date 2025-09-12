'use client';

import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, User, Settings } from "lucide-react";
import Link from "next/link";

interface AppLayoutProps {
  children: ReactNode;
}

interface CustomBreadcrumbItem {
  label: string;
  href: string;
  isLast: boolean;
}

// Função para gerar breadcrumbs baseado na rota
function generateBreadcrumbs(pathname: string): CustomBreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean);
  
  const breadcrumbMap: Record<string, string> = {
    '': 'Dashboard',
    'workouts': 'Treinos',
    'exercises': 'Exercícios',
    'calculators': 'Calculadoras',
    'stats': 'Estatísticas',
    'profile': 'Perfil',
    'settings': 'Configurações',
    'create': 'Criar',
    'admin': 'Administração',
  };

  const breadcrumbs: CustomBreadcrumbItem[] = [
    { label: 'Dashboard', href: '/', isLast: false },
  ];

  let currentPath = '';
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const label = breadcrumbMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
    
    breadcrumbs.push({
      label,
      href: currentPath,
      isLast: index === segments.length - 1,
    });
  });

  return breadcrumbs.slice(1); // Remove o primeiro Dashboard duplicado se não estiver na home
}

export function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();
  const { user, profile, signOut } = useAuth();
  const breadcrumbs = generateBreadcrumbs(pathname);
  
  // Título da página baseado na rota
  const getPageTitle = () => {
    if (pathname === '/') return 'Dashboard';
    if (pathname === '/workouts') return 'Meus Treinos';
    if (pathname === '/workouts/create') return 'Criar Treino';
    if (pathname === '/exercises') return 'Biblioteca de Exercícios';
    if (pathname === '/exercises/create') return 'Criar Exercício';
    if (pathname === '/calculators') return 'Calculadoras de Saúde';
    if (pathname === '/stats') return 'Estatísticas';
    if (pathname === '/profile') return 'Perfil';
    if (pathname === '/settings') return 'Configurações';
    if (pathname === '/admin') return 'Painel Administrativo';
    
    // Fallback para rotas dinâmicas
    const segments = pathname.split('/').filter(Boolean);
    return segments[segments.length - 1]?.charAt(0).toUpperCase() + segments[segments.length - 1]?.slice(1) || 'Página';
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4 flex-1">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            
            {/* Breadcrumbs */}
            {breadcrumbs.length > 0 && (
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="/">
                      Dashboard
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  {breadcrumbs.map((breadcrumb, index) => (
                    <div key={breadcrumb.href} className="flex items-center gap-2">
                      <BreadcrumbSeparator className="hidden md:block" />
                      <BreadcrumbItem>
                        {breadcrumb.isLast ? (
                          <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink href={breadcrumb.href}>
                            {breadcrumb.label}
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                    </div>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            )}
          </div>
          
          {/* User Menu & Theme Toggle */}
          <div className="flex items-center gap-2 px-4">
            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={''} alt={profile?.displayName || user?.username || ''} />
                    <AvatarFallback>
                      {profile?.displayName?.charAt(0) || user?.username?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {profile?.displayName || 'Usuário'}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {profile?.email || user?.username}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Perfil</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Configurações</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer text-red-600 focus:text-red-600"
                  onClick={() => signOut()}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <ThemeToggle />
          </div>
        </header>
        
        {/* Conteúdo principal */}
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
            <div className="p-6">
              {/* Título da página */}
              <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight">{getPageTitle()}</h1>
                {pathname !== '/' && (
                  <p className="text-muted-foreground mt-2">
                    {pathname === '/workouts' && 'Gerencie seus treinos personalizados'}
                    {pathname === '/workouts/create' && 'Crie um novo treino personalizado'}
                    {pathname === '/exercises' && 'Explore e gerencie exercícios'}
                    {pathname === '/exercises/create' && 'Adicione um novo exercício à biblioteca'}
                    {pathname === '/calculators' && 'Ferramentas para monitorar sua saúde e fitness'}
                    {pathname === '/stats' && 'Acompanhe seu progresso e estatísticas'}
                    {pathname === '/admin' && 'Gerencie exercícios, usuários e conteúdo da plataforma'}
                  </p>
                )}
              </div>
              
              {/* Conteúdo da página */}
              {children}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}