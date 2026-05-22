import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useLanguage } from "@/contexts/LanguageContext";

const accidentData = [
  { year: "2019", motorrad: 28000, ski: 42000 },
  { year: "2020", motorrad: 26500, ski: 38000 },
  { year: "2021", motorrad: 29000, ski: 45000 },
  { year: "2022", motorrad: 30500, ski: 47000 },
  { year: "2023", motorrad: 31000, ski: 49000 },
];

const COLORS = ["hsl(0,85%,55%)", "hsl(210,80%,55%)", "hsl(30,90%,55%)", "hsl(220,15%,35%)"];

export default function SurveysPage() {
  const { t } = useLanguage();
  const causeData = [
    { name: t("surveys.cause.visibility"), value: 35 },
    { name: t("surveys.cause.brake"), value: 25 },
    { name: t("surveys.cause.shock"), value: 20 },
    { name: t("surveys.cause.other"), value: 20 },
  ];

  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        <motion.div className="text-center mb-14" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            {t("surveys.title1")} <span className="text-gradient-accent">{t("surveys.title2")}</span>
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">{t("surveys.subtitle")}</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <motion.div
            className="rounded-xl border border-border bg-card-gradient p-6"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          >
            <h3 className="font-heading text-lg font-semibold mb-6">{t("surveys.chart1")}</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={accidentData}>
                <XAxis dataKey="year" stroke="hsl(220,10%,40%)" fontSize={12} />
                <YAxis stroke="hsl(220,10%,40%)" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(220,18%,10%)", border: "1px solid hsl(220,15%,18%)", borderRadius: "8px", color: "hsl(0,0%,95%)" }} />
                <Bar dataKey="motorrad" name={t("mode.motorcycle")} fill="hsl(0,85%,55%)" radius={[4,4,0,0]} />
                <Bar dataKey="ski" name={t("mode.ski")} fill="hsl(210,80%,55%)" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            className="rounded-xl border border-border bg-card-gradient p-6"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          >
            <h3 className="font-heading text-lg font-semibold mb-6">{t("surveys.chart2")}</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={causeData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, value }) => `${name}: ${value}%`}>
                  {causeData.map((_, i) => (<Cell key={i} fill={COLORS[i]} />))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        <motion.div
          className="max-w-2xl mx-auto mt-12 rounded-xl border border-primary/30 bg-primary/5 p-8 text-center"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        >
          <h3 className="font-heading text-2xl font-bold mb-3 text-gradient-accent">60%</h3>
          <p className="text-muted-foreground">{t("surveys.insight")}</p>
        </motion.div>
      </div>
    </div>
  );
}
