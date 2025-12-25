import { motion } from "framer-motion";
import {
  Camera,
  Github,
  Key,
  LogOut,
  Mail,
  Save,
  Shield,
  User,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export default function Profile() {
  const [profile, setProfile] = useState({
    name: "John Developer",
    email: "john@example.com",
    avatar: "",
    githubConnected: false,
  });

  const [settings, setSettings] = useState({
    emailNotifications: true,
    autoSave: true,
    twoFactor: false,
  });

  const handleSave = () => {
    toast.success("Profile updated successfully!");
  };

  const handleConnectGithub = () => {
    toast.info("GitHub integration - Connect to Supabase to enable");
  };

  return (
    <div className="min-h-screen bg-background py-6 sm:py-8 px-4">
      <div className="container max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Profile Settings</h1>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            {/* Avatar Section */}
            <div className="md:col-span-1">
              <div className="glass rounded-xl p-4 sm:p-6 text-center">
                <div className="relative inline-block mb-4">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    {profile.avatar ? (
                      <img
                        src={profile.avatar}
                        alt="Avatar"
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-12 w-12 sm:h-16 sm:w-16 text-primary" />
                    )}
                  </div>
                  <button className="absolute bottom-0 right-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
                    <Camera className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                </div>
                <h3 className="font-semibold text-base sm:text-lg">{profile.name}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">{profile.email}</p>
              </div>
            </div>

            {/* Settings Section */}
            <div className="md:col-span-2 space-y-4 sm:space-y-6">
              {/* Account Info */}
              <div className="glass rounded-xl p-4 sm:p-6">
                <h3 className="font-semibold mb-4 sm:mb-6 flex items-center gap-2 text-sm sm:text-base">
                  <User className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  Account Information
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Display Name</Label>
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) =>
                        setProfile({ ...profile, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        onChange={(e) =>
                          setProfile({ ...profile, email: e.target.value })
                        }
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* GitHub Connection */}
              <div className="glass rounded-xl p-4 sm:p-6">
                <h3 className="font-semibold mb-4 sm:mb-6 flex items-center gap-2 text-sm sm:text-base">
                  <Github className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  GitHub Integration
                </h3>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <p className="font-medium">Connect GitHub</p>
                    <p className="text-sm text-muted-foreground">
                      Push code directly to your repositories
                    </p>
                  </div>
                  <Button
                    variant={profile.githubConnected ? "glass" : "hero"}
                    onClick={handleConnectGithub}
                  >
                    {profile.githubConnected ? "Connected" : "Connect"}
                  </Button>
                </div>
              </div>

              {/* Preferences */}
              <div className="glass rounded-xl p-4 sm:p-6">
                <h3 className="font-semibold mb-4 sm:mb-6 flex items-center gap-2 text-sm sm:text-base">
                  <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  Preferences & Security
                </h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-muted-foreground">
                        Receive updates about your projects
                      </p>
                    </div>
                    <Switch
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) =>
                        setSettings({ ...settings, emailNotifications: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Auto-save Code</p>
                      <p className="text-sm text-muted-foreground">
                        Automatically save your work every minute
                      </p>
                    </div>
                    <Switch
                      checked={settings.autoSave}
                      onCheckedChange={(checked) =>
                        setSettings({ ...settings, autoSave: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security
                      </p>
                    </div>
                    <Switch
                      checked={settings.twoFactor}
                      onCheckedChange={(checked) =>
                        setSettings({ ...settings, twoFactor: checked })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button variant="hero" onClick={handleSave} className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  <span className="text-sm sm:text-base">Save Changes</span>
                </Button>
                <Button variant="glass" className="sm:flex-none">
                  <Key className="h-4 w-4 mr-2" />
                  <span className="text-sm sm:text-base">Change Password</span>
                </Button>
                <Button variant="ghost" className="sm:flex-none text-destructive hover:text-destructive">
                  <LogOut className="h-4 w-4 mr-2" />
                  <span className="text-sm sm:text-base">Sign Out</span>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
