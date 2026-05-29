import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useMode } from "@/contexts/ModeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Activity, Gauge, AlertTriangle, MapPin, Download, Clock,
  TrendingUp, Zap, Route, ChevronRight, MountainSnow, MapPinned, CableCar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  XAxis, YAxis, Tooltip, ResponsiveContainer,
  AreaChart, Area
} from "recharts";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const routePoints: [number, number][] = [
  [48.1351, 11.5820],
  [48.1360, 11.5840],
  [48.1375, 11.5870],
  [48.1390, 11.5900],
  [48.1405, 11.5880],
  [48.1420, 11.5910],
  [48.1440, 11.5940],
  [48.1455, 11.5960],
  [48.1470, 11.5930],
  [48.1485, 11.5950],
  [48.1500, 11.5980],
  [48.1515, 11.6010],
  [48.1530, 11.6030],
  [48.1545, 11.6000],
  [48.1555, 11.5970],
];

const brakePoints: [number, number][] = [
  [48.1375, 11.5870],
  [48.1440, 11.5940],
  [48.1530, 11.6030],
];

const shockPoints: [number, number][] = [
  [48.1455, 11.5960],
];

const skiRoutePoints: [number, number][] = [
  [47.4686, 11.0600],
  [47.4658, 11.0645],
  [47.4629, 11.0688],
  [47.4598, 11.0725],
  [47.4566, 11.0755],
  [47.4534, 11.0782],
  [47.4502, 11.0806],
  [47.4474, 11.0834],
  [47.4446, 11.0870],
];

const skiBrakePoints: [number, number][] = [
  [47.4629, 11.0688],
  [47.4566, 11.0755],
  [47.4502, 11.0806],
];

const skiShockPoints: [number, number][] = [
  [47.4534, 11.0782],
];

const motorcycleRecommendations = [
  {
    name: "Schwarzwaldhochstrasse",
    detail: "Baden-Baden bis Freudenstadt",
    meta: "61 km - viele Kurven - Aussichtspunkte",
  },
  {
    name: "Albtrauf-Runde",
    detail: "Balingen, Lochenpass und Schwaebische Alb",
    meta: "94 km - sportlich - gute Pausenstopps",
  },
  {
    name: "Bodensee-Panorama",
    detail: "Ueberlingen, Meersburg und Hoeri",
    meta: "78 km - entspannt - Seeblick",
  },
];

const skiRecommendations = [
  {
    name: "Ski Arlberg",
    detail: "St. Anton, Lech und Zuers",
    meta: "305 Pisten-km - viele rote Abfahrten",
  },
  {
    name: "KitzSki",
    detail: "Kitzbuehel und Kirchberg",
    meta: "233 Pisten-km - lange Talabfahrten",
  },
  {
    name: "Serfaus-Fiss-Ladis",
    detail: "Familienfreundlich mit breiten Pisten",
    meta: "214 Pisten-km - sehr gute Liftstruktur",
  },
];

const speedData = Array.from({ length: 30 }, (_, i) => ({
  time: `${i}:00`,
  speed: Math.max(0, 40 + Math.sin(i * 0.5) * 30 + (Math.random() - 0.5) * 15),
  accel: (Math.random() - 0.5) * 4,
}));

const timelineEvents = [
  { time: "14:02", type: "start", labelKey: "dash.event.start" },
  { time: "14:08", type: "brake", labelKey: "dash.event.brake1" },
  { time: "14:15", type: "brake", labelKey: "dash.event.brake2" },
  { time: "14:22", type: "shock", labelKey: "dash.event.shock" },
  { time: "14:28", type: "brake", labelKey: "dash.event.brake3" },
  { time: "14:35", type: "end", labelKey: "dash.event.end" },
];

function addSkiPisteMap(map: L.Map) {
  map.setView([47.4565, 11.0740], 14);

  L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
    attribution: "Tiles Esri",
    maxZoom: 18,
  }).addTo(map);

  skiBrakePoints.forEach((p) => {
    L.circleMarker(p, {
      radius: 8, fillColor: "#f59e0b", color: "#f59e0b", fillOpacity: 0.85, weight: 2,
    }).addTo(map).bindPopup("Bremsung erkannt");
  });

  skiShockPoints.forEach((p) => {
    L.circleMarker(p, {
      radius: 10, fillColor: "#ef4444", color: "#ef4444", fillOpacity: 0.9, weight: 2,
    }).addTo(map).bindPopup("Erschuetterung erkannt");
  });

  L.circleMarker(skiRoutePoints[0], {
    radius: 8, fillColor: "#22c55e", color: "#16a34a", fillOpacity: 0.95, weight: 2,
  }).addTo(map).bindPopup("Start");

  L.circleMarker(skiRoutePoints[skiRoutePoints.length - 1], {
    radius: 8, fillColor: "#3b82f6", color: "#2563eb", fillOpacity: 0.95, weight: 2,
  }).addTo(map).bindPopup("Ziel");

  L.control.scale({ imperial: false, position: "bottomleft" }).addTo(map);
}

function addMotorcycleMap(map: L.Map) {
  map.setView([48.1440, 11.5940], 14);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "OpenStreetMap",
  }).addTo(map);

  L.polyline(routePoints, { color: "hsl(0,85%,55%)", weight: 4, opacity: 0.8 }).addTo(map);

  brakePoints.forEach((p) => {
    L.circleMarker(p, {
      radius: 8, fillColor: "#f59e0b", color: "#f59e0b", fillOpacity: 0.8, weight: 2,
    }).addTo(map).bindPopup("Bremsung erkannt");
  });

  shockPoints.forEach((p) => {
    L.circleMarker(p, {
      radius: 10, fillColor: "#ef4444", color: "#ef4444", fillOpacity: 0.9, weight: 2,
    }).addTo(map).bindPopup("Erschuetterung erkannt");
  });

  L.circleMarker(routePoints[0], {
    radius: 8, fillColor: "#22c55e", color: "#22c55e", fillOpacity: 0.9, weight: 2,
  }).addTo(map).bindPopup("Start");

  L.circleMarker(routePoints[routePoints.length - 1], {
    radius: 8, fillColor: "#3b82f6", color: "#3b82f6", fillOpacity: 0.9, weight: 2,
  }).addTo(map).bindPopup("Ziel");
}

function LeafletMap({ variant }: { variant: "motorcycle" | "ski" }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const map = L.map(mapRef.current, variant === "ski" ? {
      minZoom: 11,
      maxZoom: 18,
      zoomControl: true,
      attributionControl: false,
    } : {});

    mapInstance.current = map;

    if (variant === "ski") {
      addSkiPisteMap(map);
    } else {
      addMotorcycleMap(map);
    }

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, [variant]);

  return <div ref={mapRef} className="w-full h-full rounded-lg" />;
}

function exportGPX() {
  const gpxContent = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="HN Systems">
  <trk>
    <name>Fahrt ${new Date().toLocaleDateString("de-DE")}</name>
    <trkseg>
${routePoints.map(([lat, lng]) => `      <trkpt lat="${lat}" lon="${lng}"><ele>0</ele></trkpt>`).join("\n")}
    </trkseg>
  </trk>
</gpx>`;
  const blob = new Blob([gpxContent], { type: "application/gpx+xml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `fahrt_${Date.now()}.gpx`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function DashboardPage() {
  const { mode } = useMode();
  const { t } = useLanguage();
  const isMotorcycle = mode === "motorcycle";
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const recommendations = isMotorcycle ? motorcycleRecommendations : skiRecommendations;

  if (!isLoggedIn) {
    return (
      <div className="py-20 min-h-[80vh] flex items-center justify-center">
        <motion.div
          className="max-w-md w-full mx-4 rounded-xl border border-border bg-card-gradient p-8 text-center"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        >
          <div className="h-16 w-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-6">
            <Activity className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-2">{t("dash.login.title")}</h2>
          <p className="text-muted-foreground text-sm mb-6">{t("dash.login.desc")}</p>
          <Button
            onClick={() => setIsLoggedIn(true)}
            size="lg"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground glow-red font-heading tracking-wide"
          >
            {t("dash.login.button")}
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        <motion.div className="mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold">
                {t("dash.title1")} <span className="text-gradient-accent">{t("dash.title2")}</span>
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                {isMotorcycle ? t("landing.badge.motorcycle") : t("landing.badge.ski")} - {t("dash.lastTrip")}
              </p>
            </div>
            <Button
              onClick={exportGPX}
              variant="outline"
              className="border-border text-foreground hover:bg-muted"
            >
              <Download className="h-4 w-4 mr-2" /> {t("dash.export")}
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Gauge, label: t("dash.stat.speed"), value: isMotorcycle ? "47 km/h" : "38 km/h", sub: t("dash.stat.speedSub") },
            { icon: Route, label: t("dash.stat.distance"), value: isMotorcycle ? "23.4 km" : "12.8 km", sub: t("dash.stat.distanceSub") },
            { icon: Zap, label: t("dash.stat.brakes"), value: isMotorcycle ? "12" : "8", sub: t("dash.stat.brakesSub") },
            { icon: AlertTriangle, label: t("dash.stat.shocks"), value: "1", sub: t("dash.stat.shocksSub") },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="border-border bg-card-gradient">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <stat.icon className="h-4 w-4 text-primary" />
                    <span className="text-xs text-muted-foreground">{stat.label}</span>
                  </div>
                  <div className="text-2xl font-heading font-bold">{stat.value}</div>
                  <div className="text-xs text-muted-foreground mt-1">{stat.sub}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-border bg-card-gradient h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  {isMotorcycle ? (
                    <MapPin className="h-4 w-4 text-primary" />
                  ) : (
                    <MountainSnow className="h-4 w-4 text-primary" />
                  )}
                  {isMotorcycle ? t("dash.map") : "Skigebiet Satellitenkarte"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] rounded-lg overflow-hidden">
                  <LeafletMap variant={mode} />
                </div>
                <div className="flex flex-wrap gap-4 mt-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-green-500" /> {t("dash.legend.start")}</span>
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-yellow-500" /> {isMotorcycle ? t("dash.legend.brake") : "Pisten"}</span>
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-red-500" /> {t("dash.legend.shock")}</span>
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-blue-500" /> {t("dash.legend.end")}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-border bg-card-gradient h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  {t("dash.speed")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] mb-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={speedData}>
                      <defs>
                        <linearGradient id="speedGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="time" stroke="hsl(220,10%,40%)" fontSize={10} />
                      <YAxis stroke="hsl(220,10%,40%)" fontSize={10} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(220,18%,10%)",
                          border: "1px solid hsl(220,15%,18%)",
                          borderRadius: "8px",
                          color: "hsl(0,0%,95%)",
                        }}
                        formatter={(v: number) => [`${v.toFixed(1)} km/h`, t("dash.stat.speed")]}
                      />
                      <Area
                        type="monotone"
                        dataKey="speed"
                        stroke="hsl(var(--primary))"
                        fill="url(#speedGrad)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <h4 className="text-sm font-medium mb-2">{t("dash.brakeBehavior")}</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>{t("dash.brake.light")}</span>
                      <span>{isMotorcycle ? 9 : 6}</span>
                    </div>
                    <Progress value={isMotorcycle ? 75 : 60} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>{t("dash.brake.strong")}</span>
                      <span>{isMotorcycle ? 3 : 2}</span>
                    </div>
                    <Progress value={isMotorcycle ? 25 : 20} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>{t("dash.brake.emergency")}</span>
                      <span>0</span>
                    </div>
                    <Progress value={0} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <Card className="border-border bg-card-gradient">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                {isMotorcycle ? (
                  <MapPinned className="h-4 w-4 text-primary" />
                ) : (
                  <MountainSnow className="h-4 w-4 text-primary" />
                )}
                {isMotorcycle ? "Empfohlene Motorradrouten" : "Empfohlene Skigebiete"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-3">
                {recommendations.map((item) => (
                  <div key={item.name} className="rounded-lg bg-muted/50 p-4 border border-border/70">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        {isMotorcycle ? (
                          <Route className="h-4 w-4 text-primary" />
                        ) : (
                          <CableCar className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-sm font-heading font-bold normal-case tracking-normal">{item.name}</h3>
                        <p className="text-xs text-muted-foreground mt-1">{item.detail}</p>
                        <p className="text-xs text-primary mt-2">{item.meta}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-border bg-card-gradient">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                {t("dash.timeline")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {timelineEvents.map((event, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <span className="text-sm font-mono text-muted-foreground w-12">{event.time}</span>
                    <span
                      className={`h-3 w-3 rounded-full flex-shrink-0 ${
                        event.type === "brake"
                          ? "bg-yellow-500"
                          : event.type === "shock"
                          ? "bg-red-500"
                          : event.type === "start"
                          ? "bg-green-500"
                          : "bg-blue-500"
                      }`}
                    />
                    <span className="text-sm text-foreground">{t(event.labelKey)}</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
