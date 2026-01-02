-- No new table needed - we use app_settings with keys widget_weather and widget_date
-- Just ensure sample data exists for widgets

-- Insert default weather widget settings if not exists
INSERT INTO app_settings (key, value)
VALUES (
  'widget_weather',
  '{
    "enabled": true,
    "location": "Kuala Lumpur",
    "temperature": 27,
    "condition": "Partly Cloudy",
    "showForecast": true,
    "gradientFrom": "#1e3a5f",
    "gradientTo": "#4a6fa5",
    "textColor": "#ffffff",
    "forecast": [
      {"day": "Sun", "temp": 28, "condition": "sunny"},
      {"day": "Mon", "temp": 27, "condition": "sunny"},
      {"day": "Tue", "temp": 25, "condition": "rainy"},
      {"day": "Wed", "temp": 26, "condition": "cloudy"}
    ]
  }'::jsonb
)
ON CONFLICT (key) DO NOTHING;

-- Insert default date widget settings if not exists
INSERT INTO app_settings (key, value)
VALUES (
  'widget_date',
  '{
    "enabled": true,
    "showDayName": true,
    "headerColor": "#ef4444",
    "dateColor": "#000000",
    "dayNameColor": "#000000",
    "backgroundColor": "#ffffff"
  }'::jsonb
)
ON CONFLICT (key) DO NOTHING;