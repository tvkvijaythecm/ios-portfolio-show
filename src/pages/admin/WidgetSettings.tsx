import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Calendar, Cloud, Plus, Trash2, User } from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";

interface WeatherWidgetConfig {
  enabled: boolean;
  location: string;
  temperature: number;
  condition: string;
  showForecast: boolean;
  gradientFrom: string;
  gradientTo: string;
  textColor: string;
  forecast: Array<{
    day: string;
    temp: number;
    condition: string;
  }>;
}

interface DateWidgetConfig {
  enabled: boolean;
  showDayName: boolean;
  headerColor: string;
  dateColor: string;
  dayNameColor: string;
  backgroundColor: string;
}

interface ProfileWidgetConfig {
  enabled: boolean;
  name: string;
  title: string;
  profileImage: string;
}

const WEATHER_CONDITIONS = [
  "Sunny",
  "Partly Cloudy",
  "Cloudy",
  "Rainy",
  "Light Rainy",
  "Storm",
  "Thunderstorm",
  "Snow",
  "Windy"
];

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const WidgetSettings = () => {
  const [weatherConfig, setWeatherConfig] = useState<WeatherWidgetConfig>({
    enabled: true,
    location: "Kuala Lumpur",
    temperature: 27,
    condition: "Partly Cloudy",
    showForecast: true,
    gradientFrom: "#1e3a5f",
    gradientTo: "#4a6fa5",
    textColor: "#ffffff",
    forecast: [
      { day: "Sun", temp: 28, condition: "sunny" },
      { day: "Mon", temp: 27, condition: "sunny" },
      { day: "Tue", temp: 25, condition: "rainy" },
      { day: "Wed", temp: 26, condition: "cloudy" },
    ],
  });

  const [dateConfig, setDateConfig] = useState<DateWidgetConfig>({
    enabled: true,
    showDayName: true,
    headerColor: "#ef4444",
    dateColor: "#000000",
    dayNameColor: "#000000",
    backgroundColor: "#ffffff",
  });

  const [profileConfig, setProfileConfig] = useState<ProfileWidgetConfig>({
    enabled: true,
    name: "Suresh Kaleyannan",
    title: "Creative Developer, Malaysia",
    profileImage: ""
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const [weatherRes, dateRes, profileRes] = await Promise.all([
        supabase.from("app_settings").select("value").eq("key", "widget_weather").maybeSingle(),
        supabase.from("app_settings").select("value").eq("key", "widget_date").maybeSingle(),
        supabase.from("app_settings").select("value").eq("key", "widget_profile").maybeSingle(),
      ]);

      if (weatherRes.data?.value) {
        setWeatherConfig(prev => ({ ...prev, ...(weatherRes.data.value as unknown as WeatherWidgetConfig) }));
      }
      if (dateRes.data?.value) {
        setDateConfig(prev => ({ ...prev, ...(dateRes.data.value as unknown as DateWidgetConfig) }));
      }
      if (profileRes.data?.value) {
        setProfileConfig(prev => ({ ...prev, ...(profileRes.data.value as unknown as ProfileWidgetConfig) }));
      }
    } catch (error) {
      console.error("Error loading settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const [weatherRes, dateRes, profileRes] = await Promise.all([
        supabase.from("app_settings").upsert({ 
          key: "widget_weather", 
          value: JSON.parse(JSON.stringify(weatherConfig)) 
        }, { onConflict: "key" }),
        supabase.from("app_settings").upsert({ 
          key: "widget_date", 
          value: JSON.parse(JSON.stringify(dateConfig)) 
        }, { onConflict: "key" }),
        supabase.from("app_settings").upsert({ 
          key: "widget_profile", 
          value: JSON.parse(JSON.stringify(profileConfig)) 
        }, { onConflict: "key" }),
      ]);

      if (weatherRes.error) throw weatherRes.error;
      if (dateRes.error) throw dateRes.error;
      if (profileRes.error) throw profileRes.error;

      toast.success("Widget settings saved successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const updateForecast = (index: number, field: keyof WeatherWidgetConfig['forecast'][0], value: string | number) => {
    const newForecast = [...weatherConfig.forecast];
    newForecast[index] = { ...newForecast[index], [field]: value };
    setWeatherConfig({ ...weatherConfig, forecast: newForecast });
  };

  const addForecastDay = () => {
    if (weatherConfig.forecast.length >= 7) return;
    const nextDay = DAYS_OF_WEEK[(weatherConfig.forecast.length) % 7];
    setWeatherConfig({
      ...weatherConfig,
      forecast: [...weatherConfig.forecast, { day: nextDay, temp: 25, condition: "sunny" }]
    });
  };

  const removeForecastDay = (index: number) => {
    if (weatherConfig.forecast.length <= 1) return;
    const newForecast = weatherConfig.forecast.filter((_, i) => i !== index);
    setWeatherConfig({ ...weatherConfig, forecast: newForecast });
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <AdminHeader title="Widget Settings" description="Customize home screen widgets" />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Weather Widget Settings */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Cloud className="w-5 h-5" />
              Weather Widget
            </CardTitle>
            <CardDescription className="text-white/60">
              Configure the weather widget on home screen
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-white/80">Enable Widget</Label>
                <p className="text-white/40 text-sm">Show weather widget on home screen</p>
              </div>
              <Switch
                checked={weatherConfig.enabled}
                onCheckedChange={(checked) => setWeatherConfig({ ...weatherConfig, enabled: checked })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white/80">Location</Label>
                <Input
                  value={weatherConfig.location}
                  onChange={(e) => setWeatherConfig({ ...weatherConfig, location: e.target.value })}
                  placeholder="City name"
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white/80">Temperature (°C)</Label>
                <Input
                  type="number"
                  value={weatherConfig.temperature}
                  onChange={(e) => setWeatherConfig({ ...weatherConfig, temperature: parseInt(e.target.value) || 0 })}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-white/80">Weather Condition</Label>
              <Select
                value={weatherConfig.condition}
                onValueChange={(value) => setWeatherConfig({ ...weatherConfig, condition: value })}
              >
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {WEATHER_CONDITIONS.map((condition) => (
                    <SelectItem key={condition} value={condition}>
                      {condition}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="text-white/80">Gradient Colors</Label>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-white/60 text-xs">From</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={weatherConfig.gradientFrom}
                      onChange={(e) => setWeatherConfig({ ...weatherConfig, gradientFrom: e.target.value })}
                      className="w-10 h-10 rounded cursor-pointer"
                    />
                    <Input
                      value={weatherConfig.gradientFrom}
                      onChange={(e) => setWeatherConfig({ ...weatherConfig, gradientFrom: e.target.value })}
                      className="bg-white/10 border-white/20 text-white text-xs"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-white/60 text-xs">To</Label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={weatherConfig.gradientTo}
                      onChange={(e) => setWeatherConfig({ ...weatherConfig, gradientTo: e.target.value })}
                      className="w-10 h-10 rounded cursor-pointer"
                    />
                    <Input
                      value={weatherConfig.gradientTo}
                      onChange={(e) => setWeatherConfig({ ...weatherConfig, gradientTo: e.target.value })}
                      className="bg-white/10 border-white/20 text-white text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-white/80">Text Color</Label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={weatherConfig.textColor}
                  onChange={(e) => setWeatherConfig({ ...weatherConfig, textColor: e.target.value })}
                  className="w-10 h-10 rounded cursor-pointer"
                />
                <Input
                  value={weatherConfig.textColor}
                  onChange={(e) => setWeatherConfig({ ...weatherConfig, textColor: e.target.value })}
                  className="bg-white/10 border-white/20 text-white flex-1"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-white/80">Show Forecast</Label>
                <p className="text-white/40 text-sm">Display weather forecast days</p>
              </div>
              <Switch
                checked={weatherConfig.showForecast}
                onCheckedChange={(checked) => setWeatherConfig({ ...weatherConfig, showForecast: checked })}
              />
            </div>

            {weatherConfig.showForecast && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-white/80">Forecast Days</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addForecastDay}
                    disabled={weatherConfig.forecast.length >= 7}
                    className="text-white border-white/20 hover:bg-white/10"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Day
                  </Button>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {weatherConfig.forecast.map((day, i) => (
                    <div key={i} className="flex items-center gap-2 bg-white/5 p-2 rounded-lg">
                      <Select
                        value={day.day}
                        onValueChange={(value) => updateForecast(i, "day", value)}
                      >
                        <SelectTrigger className="bg-white/10 border-white/20 text-white w-20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {DAYS_OF_WEEK.map((d) => (
                            <SelectItem key={d} value={d}>{d}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        type="number"
                        value={day.temp}
                        onChange={(e) => updateForecast(i, "temp", parseInt(e.target.value) || 0)}
                        className="bg-white/10 border-white/20 text-white w-16"
                        placeholder="Temp"
                      />
                      <Select
                        value={day.condition}
                        onValueChange={(value) => updateForecast(i, "condition", value)}
                      >
                        <SelectTrigger className="bg-white/10 border-white/20 text-white flex-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {WEATHER_CONDITIONS.map((c) => (
                            <SelectItem key={c} value={c.toLowerCase()}>{c}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeForecastDay(i)}
                        disabled={weatherConfig.forecast.length <= 1}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Date Widget Settings */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Date Widget
            </CardTitle>
            <CardDescription className="text-white/60">
              Configure the date/calendar widget on home screen
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-white/80">Enable Widget</Label>
                <p className="text-white/40 text-sm">Show date widget on home screen</p>
              </div>
              <Switch
                checked={dateConfig.enabled}
                onCheckedChange={(checked) => setDateConfig({ ...dateConfig, enabled: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-white/80">Show Day Name</Label>
                <p className="text-white/40 text-sm">Display the day of week (e.g., Sunday)</p>
              </div>
              <Switch
                checked={dateConfig.showDayName}
                onCheckedChange={(checked) => setDateConfig({ ...dateConfig, showDayName: checked })}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white/80">Header Color (Month Bar)</Label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={dateConfig.headerColor}
                  onChange={(e) => setDateConfig({ ...dateConfig, headerColor: e.target.value })}
                  className="w-10 h-10 rounded cursor-pointer"
                />
                <Input
                  value={dateConfig.headerColor}
                  onChange={(e) => setDateConfig({ ...dateConfig, headerColor: e.target.value })}
                  className="bg-white/10 border-white/20 text-white flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-white/80">Background Color</Label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={dateConfig.backgroundColor}
                  onChange={(e) => setDateConfig({ ...dateConfig, backgroundColor: e.target.value })}
                  className="w-10 h-10 rounded cursor-pointer"
                />
                <Input
                  value={dateConfig.backgroundColor}
                  onChange={(e) => setDateConfig({ ...dateConfig, backgroundColor: e.target.value })}
                  className="bg-white/10 border-white/20 text-white flex-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white/80">Date Number Color</Label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={dateConfig.dateColor}
                    onChange={(e) => setDateConfig({ ...dateConfig, dateColor: e.target.value })}
                    className="w-10 h-10 rounded cursor-pointer"
                  />
                  <Input
                    value={dateConfig.dateColor}
                    onChange={(e) => setDateConfig({ ...dateConfig, dateColor: e.target.value })}
                    className="bg-white/10 border-white/20 text-white flex-1 text-xs"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-white/80">Day Name Color</Label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={dateConfig.dayNameColor}
                    onChange={(e) => setDateConfig({ ...dateConfig, dayNameColor: e.target.value })}
                    className="w-10 h-10 rounded cursor-pointer"
                  />
                  <Input
                    value={dateConfig.dayNameColor}
                    onChange={(e) => setDateConfig({ ...dateConfig, dayNameColor: e.target.value })}
                    className="bg-white/10 border-white/20 text-white flex-1 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="space-y-2">
              <Label className="text-white/80">Preview</Label>
              <div className="flex justify-center p-4 bg-white/5 rounded-lg">
                <div 
                  className="w-24 aspect-square rounded-2xl overflow-hidden shadow-lg"
                  style={{ backgroundColor: dateConfig.backgroundColor }}
                >
                  <div 
                    className="h-[30%] flex items-center justify-center"
                    style={{ backgroundColor: dateConfig.headerColor }}
                  >
                    <span className="text-white font-bold text-xs tracking-wider">
                      {new Date().toLocaleDateString("en-US", { month: "long" }).toUpperCase()}
                    </span>
                  </div>
                  <div className="h-[70%] flex flex-col items-center justify-center">
                    <span 
                      className="text-3xl font-light"
                      style={{ color: dateConfig.dateColor }}
                    >
                      {new Date().getDate()}
                    </span>
                    {dateConfig.showDayName && (
                      <span 
                        className="text-sm"
                        style={{ color: dateConfig.dayNameColor }}
                      >
                        {new Date().toLocaleDateString("en-US", { weekday: "long" })}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Widget Settings */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <User className="w-5 h-5" />
              Profile Widget
            </CardTitle>
            <CardDescription className="text-white/60">
              Configure the profile widget on home screen
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-white/80">Enable Widget</Label>
                <p className="text-white/40 text-sm">Show profile widget on home screen</p>
              </div>
              <Switch
                checked={profileConfig.enabled}
                onCheckedChange={(checked) => setProfileConfig({ ...profileConfig, enabled: checked })}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white/80">Name</Label>
              <Input
                value={profileConfig.name}
                onChange={(e) => setProfileConfig({ ...profileConfig, name: e.target.value })}
                placeholder="Your name"
                className="bg-white/10 border-white/20 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white/80">Title</Label>
              <Input
                value={profileConfig.title}
                onChange={(e) => setProfileConfig({ ...profileConfig, title: e.target.value })}
                placeholder="Your title/location"
                className="bg-white/10 border-white/20 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white/80">Profile Image URL</Label>
              <Input
                value={profileConfig.profileImage}
                onChange={(e) => setProfileConfig({ ...profileConfig, profileImage: e.target.value })}
                placeholder="https://example.com/image.jpg"
                className="bg-white/10 border-white/20 text-white"
              />
            </div>

            {/* Preview */}
            <div className="space-y-2">
              <Label className="text-white/80">Preview</Label>
              <div className="flex justify-center p-4 bg-white/5 rounded-lg">
                <div className="w-full max-w-xs bg-white/90 rounded-2xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-orange-400 ring-offset-2 ring-offset-white/50 bg-gray-200">
                      {profileConfig.profileImage && (
                        <img 
                          src={profileConfig.profileImage} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div>
                      <h3 className="text-gray-900 font-bold text-sm">{profileConfig.name || "Your Name"}</h3>
                      <p className="text-gray-600 text-xs">{profileConfig.title || "Your Title"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <div className="mt-6 flex justify-end">
        <Button 
          onClick={handleSave} 
          disabled={saving}
          className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
        >
          {saving ? "Saving..." : "Save Widget Settings"}
        </Button>
      </div>
    </div>
  );
};

export default WidgetSettings;
