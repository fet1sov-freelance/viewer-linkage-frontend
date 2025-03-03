import { Button } from "@/components/ui/button";
import { LogIn, UserPlus, Wallet, Video, BookOpen, Settings, Users, LogOut } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { User } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";

interface AuthButtonsProps {
  isMobile: boolean;
}

const createLoginSchema = (t: (key: string) => string) => z.object({
  email: z.string().email(t('auth.invalidEmail')),
  password: z.string().min(6, t('auth.passwordTooShort')),
});

const createRegisterSchema = (t: (key: string) => string) => z.object({
  username: z.string().min(3, t('auth.usernameTooShort')),
  email: z.string().email(t('auth.invalidEmail')),
  password: z.string().min(6, t('auth.passwordTooShort')),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: t('auth.passwordsDoNotMatch'),
  path: ["confirmPassword"],
});

export function AuthButtons({ isMobile }: AuthButtonsProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [balance, setBalance] = useState("0.00");

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error.message);
          if (error.message.includes('refresh_token_not_found')) {
            // Clear local storage and reset state if refresh token is invalid
            await supabase.auth.signOut();
            setUser(null);
            localStorage.clear();
          }
          return;
        }
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Error initializing auth:', error);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      
      if (event === 'TOKEN_REFRESHED') {
        console.log('Token refreshed successfully');
      }
      
      if (event === 'SIGNED_OUT') {
        setUser(null);
        setBalance("0.00");
        localStorage.clear();
      } else if (session?.user) {
        setUser(session.user);
        if (!localStorage.getItem('welcomeShown')) {
          toast({
            title: t('auth.success'),
            description: t('auth.welcomeBack'),
          });
          localStorage.setItem('welcomeShown', 'true');
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [t]);

  const loginSchema = createLoginSchema(t);
  const registerSchema = createRegisterSchema(t);

  type LoginFormValues = z.infer<typeof loginSchema>;
  type RegisterFormValues = z.infer<typeof registerSchema>;

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onLoginSubmit = async (values: LoginFormValues) => {
    try {
      setIsLoading(true);
      
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (signInError) {
        toast({
          title: t('auth.error'),
          description: t('auth.invalidCredentials'),
          variant: "destructive",
          position: "top-center",
        });
        return;
      }

      toast({
        title: t('auth.success'),
        description: t('auth.welcomeBack'),
        position: "top-center",
      });

      setIsLoginOpen(false);
      loginForm.reset();
    } catch (error) {
      toast({
        title: t('auth.error'),
        description: t('auth.unexpectedError'),
        variant: "destructive",
        position: "top-center",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onRegisterSubmit = async (values: RegisterFormValues) => {
    try {
      setIsLoading(true);
      
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            username: values.username,
          },
        },
      });

      if (signUpError) {
        toast({
          title: t('auth.error'),
          description: t('auth.unexpectedError'),
          variant: "destructive",
          position: "top-center",
        });
        return;
      }

      toast({
        title: t('auth.success'),
        description: t('auth.accountCreated'),
        position: "top-center",
      });

      setIsRegisterOpen(false);
      registerForm.reset();
    } catch (error) {
      toast({
        title: t('auth.error'),
        description: t('auth.unexpectedError'),
        variant: "destructive",
        position: "top-center",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: t('auth.signedOut'),
        description: t('auth.comeBackSoon'),
      });
      
      // Clear user state and navigate to home
      setUser(null);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: t('auth.error'),
        description: t('auth.unexpectedError'),
        variant: "destructive",
      });
    }
  };

  const handleMyStream = () => {
    navigate('/stream');
    toast({
      title: t('stream.title'),
      description: t('stream.startStreaming'),
    });
  };

  const handleGuide = () => {
    navigate('/guide');
    toast({
      title: t('guide.title'),
      description: t('guide.welcome'),
    });
  };

  const handleSettings = () => {
    navigate('/settings');
    toast({
      title: t('settings.title'),
      description: t('settings.configure'),
    });
  };

  const handleReferral = () => {
    navigate('/referral');
    toast({
      title: t('referral.title'),
      description: t('referral.program'),
    });
  };

  const handleDeposit = () => {
    toast({
      title: "Пополнение баланса",
      description: "Функция пополнения баланса будет доступна в ближайшее время",
    });
  };

  const handleWithdraw = () => {
    toast({
      title: "Вывод средств",
      description: "Функция вывода средств будет доступна в ближайшее время",
    });
  };

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-lg cursor-pointer hover:bg-secondary/80 transition-colors">
              <Wallet className="h-4 w-4" />
              <span className="font-medium">${balance}</span>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={handleDeposit}>
              <span>Пополнить баланс</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleWithdraw}>
              <span>Вывести средства</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex flex-col items-center">
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar>
                  <AvatarImage src={user.user_metadata.avatar_url} />
                  <AvatarFallback>
                    {user.email?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
              <span className="text-xs mt-1">{user.user_metadata.username || user.email?.split('@')[0]}</span>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={handleMyStream}>
              <Video className="mr-2 h-4 w-4" />
              <span>Моя трансляция</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleGuide}>
              <BookOpen className="mr-2 h-4 w-4" />
              <span>Гайд по сайту</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSettings}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Настройки профиля</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleReferral}>
              <Users className="mr-2 h-4 w-4" />
              <span>Реферальная программа</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Выход</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  return (
    <>
      <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size={isMobile ? "icon" : "default"} className="hidden sm:flex">
            <UserPlus className="h-4 w-4" />
            {!isMobile && <span className="ml-2">{t('auth.register')}</span>}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl">
              {t('auth.register')}
            </DialogTitle>
          </DialogHeader>
          <Form {...registerForm}>
            <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4 mt-4">
              <FormField
                control={registerForm.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('auth.username')}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={registerForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('auth.email')}</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={registerForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('auth.password')}</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={registerForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('auth.confirmPassword')}</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? t('auth.loading') : t('auth.registerButton')}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
        <DialogTrigger asChild>
          <Button size={isMobile ? "icon" : "default"}>
            <LogIn className="h-4 w-4" />
            {!isMobile && <span className="ml-2">{t('auth.login')}</span>}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl">{t('auth.login')}</DialogTitle>
          </DialogHeader>
          <Form {...loginForm}>
            <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4 mt-4">
              <FormField
                control={loginForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('auth.email')}</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={loginForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('auth.password')}</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? t('auth.loading') : t('auth.loginButton')}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
