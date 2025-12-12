import { useState, useEffect } from "react";
import { BackgroundManager } from "@/components/BackgroundManager";
import { 
  Users, 
  Bell, 
  ShieldAlert, 
  Lock, 
  Unlock, 
  Activity, 
  Search, 
  Send,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

// Mock User Data
const MOCK_USERS = [
  { id: 1, name: "Олександр К.", device: "iPhone 13", status: "online", location: "Київ" },
  { id: 2, name: "Марія В.", device: "Samsung S21", status: "offline", location: "Львів" },
  { id: 3, name: "Іван П.", device: "Xiaomi Redmi", status: "online", location: "Суми" },
  { id: 4, name: "Анна С.", device: "iPhone 11", status: "blocked", location: "Одеса" },
  { id: 5, name: "Дмитро Р.", device: "Pixel 6", status: "online", location: "Харків" },
];

export default function AdminPage() {
  const { toast } = useToast();
  const [isLightPageBlocked, setIsLightPageBlocked] = useState(false);
  const [pushMessage, setPushMessage] = useState("");
  const [users, setUsers] = useState(MOCK_USERS);
  const [searchTerm, setSearchTerm] = useState("");

  // Load initial settings
  useEffect(() => {
    const blocked = localStorage.getItem("light_page_blocked") === "true";
    setIsLightPageBlocked(blocked);
  }, []);

  const toggleLightBlock = (checked: boolean) => {
    setIsLightPageBlocked(checked);
    localStorage.setItem("light_page_blocked", checked.toString());
    toast({
      title: checked ? "Доступ заблоковано" : "Доступ відновлено",
      description: `Сторінка 'Світло' тепер ${checked ? "недоступна" : "доступна"} для користувачів.`,
      variant: checked ? "destructive" : "default",
    });
  };

  const sendPushNotification = () => {
    if (!pushMessage.trim()) return;
    
    toast({
      title: "Push-повідомлення надіслано",
      description: `Повідомлення "${pushMessage}" відправлено ${users.length} користувачам.`,
    });
    setPushMessage("");
  };

  const toggleUserBlock = (userId: number) => {
    setUsers(users.map(u => {
      if (u.id === userId) {
        const newStatus = u.status === "blocked" ? "offline" : "blocked";
        toast({
          title: newStatus === "blocked" ? "Користувача заблоковано" : "Користувача розблоковано",
          description: `Статус користувача ${u.name} змінено.`,
        });
        return { ...u, status: newStatus };
      }
      return u;
    }));
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
      {/* Admin Header */}
      <header className="bg-slate-900 border-b border-white/10 p-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <ShieldAlert className="w-8 h-8 text-red-500" />
          <div>
            <h1 className="font-bold text-xl">Admin Panel</h1>
            <p className="text-xs text-slate-400">Ясний День та Світло</p>
          </div>
        </div>
        <Link href="/">
          <Button variant="outline" size="sm" className="gap-2 border-white/20 hover:bg-white/10 text-white">
            <LogOut className="w-4 h-4" />
            Вийти
          </Button>
        </Link>
      </header>

      <main className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-slate-900 border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Активні користувачі</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white flex items-center gap-2">
                1,234
                <Activity className="w-4 h-4 text-green-500 animate-pulse" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-900 border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Push підписники</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">856</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Статус системи</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="outline" className="text-green-500 border-green-500 bg-green-500/10">
                Стабільно
              </Badge>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          
          {/* Global Controls */}
          <Card className="bg-slate-900 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Lock className="w-5 h-5 text-yellow-500" />
                Керування доступом
              </CardTitle>
              <CardDescription>Глобальні налаштування доступності розділів</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="space-y-1">
                  <h3 className="font-medium text-white">Блокування розділу "Світло"</h3>
                  <p className="text-sm text-slate-400">Тимчасово вимкнути доступ до графіків для всіх</p>
                </div>
                <Switch 
                  checked={isLightPageBlocked}
                  onCheckedChange={toggleLightBlock}
                />
              </div>
            </CardContent>
          </Card>

          {/* Push Notifications */}
          <Card className="bg-slate-900 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Bell className="w-5 h-5 text-blue-500" />
                Push Розсилка
              </CardTitle>
              <CardDescription>Відправити миттєве повідомлення всім користувачам</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input 
                  placeholder="Введіть текст повідомлення..." 
                  value={pushMessage}
                  onChange={(e) => setPushMessage(e.target.value)}
                  className="bg-white/5 border-white/10 text-white"
                />
                <Button onClick={sendPushNotification} className="bg-blue-600 hover:bg-blue-700">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <div className="text-xs text-slate-500">
                * Повідомлення буде доставлено протягом 5 хвилин
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Management */}
        <Card className="bg-slate-900 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-500" />
              Користувачі
            </CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <Search className="w-4 h-4 text-slate-500" />
              <Input 
                placeholder="Пошук по імені або місту..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-xs bg-white/5 border-white/10 text-white h-8 text-sm"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-white/10 overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-white/5 text-slate-400">
                  <tr>
                    <th className="p-3">Користувач</th>
                    <th className="p-3">Пристрій</th>
                    <th className="p-3">Місто</th>
                    <th className="p-3">Статус</th>
                    <th className="p-3 text-right">Дії</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-3 font-medium text-white">{user.name}</td>
                      <td className="p-3 text-slate-400">{user.device}</td>
                      <td className="p-3 text-slate-400">{user.location}</td>
                      <td className="p-3">
                        <Badge variant="outline" className={`
                          ${user.status === 'online' ? 'text-green-500 border-green-500/50' : ''}
                          ${user.status === 'offline' ? 'text-slate-500 border-slate-500/50' : ''}
                          ${user.status === 'blocked' ? 'text-red-500 border-red-500/50' : ''}
                        `}>
                          {user.status}
                        </Badge>
                      </td>
                      <td className="p-3 text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => toggleUserBlock(user.id)}
                          className={user.status === 'blocked' ? "text-green-500 hover:text-green-400 hover:bg-green-500/10" : "text-red-500 hover:text-red-400 hover:bg-red-500/10"}
                        >
                          {user.status === 'blocked' ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

      </main>
    </div>
  );
}
