import { Card } from "../components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/ui/accordion";
import { Badge } from "../components/ui/badge";
import { Leaf, Heart, Shield, Calculator, TrendingUp, AlertCircle } from "lucide-react";
import { motion } from "motion/react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

const data = [
  { name: "Carbon", value: 45, color: "#ffb1e9" },
  { name: "Health", value: 35, color: "#b43582" },
  { name: "Regulatory", value: 20, color: "#404D99" }
];


export function Methodology() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
          Methodology & Calculation Process
        </h1>
        <p className="text-slate-600">
          Understanding how we evaluate and score sustainable building materials
        </p>
      </motion.div>

      {/* Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="p-6">
          <div className="flex items-start space-x-3 mb-4">
            <Calculator className="w-6 h-6 text-pink-accent mt-1 flex-shrink-0" />
            <div>
              <h2 className="text-xl font-semibold text-slate-900 mb-2">Scoring Overview</h2>
              <p className="text-slate-600">
                Our analysis uses a weighted scoring system that evaluates materials across three key
                sustainability dimensions. Each material receives a score from 0-100, with higher
                scores indicating better overall sustainability performance.
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center mt-6">
            <PieChart width={300} height={250}>
              <Pie
                data={data}
                dataKey="value"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={3}
                label={({ percent }) => `${Math.round(percent * 100)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>

            {/* Optional legend (matches your old labels) */}
            <div className="flex gap-4 mt-4 text-sm">
              {data.map((item) => (
                <div key={item.name} className="flex items-center gap-1">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  {item.name}
                </div>
              ))}
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Detailed Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-2xl font-semibold text-slate-900 mb-4">Evaluation Metrics</h2>
        <Accordion type="single" collapsible className="space-y-3">
          {/* Carbon Emissions */}
          <AccordionItem value="carbon" className="border rounded-lg px-6 bg-white">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-carbon-background rounded-lg flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-carbon-accent" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-slate-900">Carbon Emissions</div>
                  <div className="text-sm text-slate-500">45% weight</div>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-4 pb-2">
              <div className="space-y-4 text-slate-600">
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">What We Measure</h4>
                  <p>
                    Embodied carbon emissions measured in kg CO₂e (carbon dioxide equivalent) per
                    kilogram of material. This includes extraction, processing, manufacturing, and
                    transportation.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">Calculation Method</h4>
                  <p className="mb-2">
                    Carbon score is normalized from -1.0 to 2.0 kg CO₂e/kg and converted to a
                    0-100 scale:
                  </p>
                  <code className="block bg-slate-100 p-3 rounded text-sm">
                    Carbon Score = ((2.0 - emissions) / 3.0) × 100
                  </code>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">Key Insights</h4>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Negative values indicate carbon sequestration (material stores CO₂)</li>
                    <li>Materials like CLT and hempcrete can have negative emissions</li>
                    <li>Traditional materials like virgin steel have high emissions (1.8+ kg CO₂e/kg)</li>
                  </ul>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Public Health */}
          <AccordionItem value="health" className="border rounded-lg px-6 bg-white">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-health-background rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-health-accent" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-slate-900">Public Health Impact</div>
                  <div className="text-sm text-slate-500">35% weight</div>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-4 pb-2">
              <div className="space-y-4 text-slate-600">
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">What We Measure</h4>
                  <p>Three distinct health impact categories, each scored 0-100 (lower is better):</p>
                  <ul className="list-disc list-inside space-y-1 mt-2">
                    <li>
                      <strong>Urban Heat Island Effect:</strong> How much heat the material absorbs
                      and radiates
                    </li>
                    <li>
                      <strong>Air Quality Impact:</strong> VOC emissions and air pollution during use
                    </li>
                    <li>
                      <strong>Construction Exposure:</strong> Worker health risks during installation
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">Calculation Method</h4>
                  <p className="mb-2">Average of three metrics, inverted to higher-is-better scale:</p>
                  <code className="block bg-slate-100 p-3 rounded text-sm">
                    Health Score = 100 - ((heat + air + exposure) / 3)
                  </code>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">Best Performers</h4>
                  <p>
                    Natural materials like rammed earth, cellulose, and bamboo typically score
                    highest (85-95). Metals and fiberglass score lower (30-50) due to heat
                    retention and installation risks.
                  </p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Regulatory Compliance */}
          <AccordionItem value="regulatory" className="border rounded-lg px-6 bg-white">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-regulatory-background rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-regulatory-accent" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-slate-900">Regulatory Compliance</div>
                  <div className="text-sm text-slate-500">20% weight</div>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-4 pb-2">
              <div className="space-y-4 text-slate-600">
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">What We Measure</h4>
                  <p>
                    Whether the material meets standard building codes and industry regulations.
                    Compliance ensures the material can be legally used in most jurisdictions.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">Calculation Method</h4>
                  <p className="mb-2">Binary scoring based on compliance status:</p>
                  <code className="block bg-slate-100 p-3 rounded text-sm">
                    Regulatory Score = compliant ? 100 : 0
                  </code>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">Common Standards</h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="outline">ASTM Standards</Badge>
                    <Badge variant="outline">ACI 318</Badge>
                    <Badge variant="outline">AISC 360</Badge>
                    <Badge variant="outline">IBC 2304</Badge>
                    <Badge variant="outline">ISO 22157</Badge>
                  </div>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-amber-900">
                      <strong>Important:</strong> Some innovative materials (like hempcrete) may not
                      be approved in all jurisdictions despite excellent sustainability metrics.
                      Always verify local building codes before specification.
                    </p>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </motion.div>

      {/* Final Score Calculation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="p-6">
          <div className="flex items-start space-x-3 mb-4">
            <TrendingUp className="w-6 h-6 text-pink-accent mt-1 flex-shrink-0" />
            <div>
              <h2 className="text-xl font-semibold text-slate-900 mb-2">Overall Score Formula</h2>
              <p className="text-slate-600 mb-4">
                The final sustainability score combines all four metrics using weighted averages:
              </p>
              <div className="bg-slate-100 p-4 rounded-lg">
                <code className="text-sm block mb-2">
                  <strong>Overall Score =</strong>
                </code>
                <code className="text-sm block ml-4">
                  (Carbon Score × 0.45) +
                </code>
                <code className="text-sm block ml-4">
                  (Health Score × 0.35) +
                </code>
                <code className="text-sm block ml-4">
                  (Regulatory Score × 0.20)
                </code>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <h3 className="font-semibold text-slate-900">Score Interpretation</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold">
                  75+
                </div>
                <div>
                  <div className="font-semibold text-green-900">Excellent</div>
                  <div className="text-sm text-green-700">Highly sustainable choice</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                <div className="w-12 h-12 bg-yellow-600 rounded-lg flex items-center justify-center text-white font-bold">
                  60+
                </div>
                <div>
                  <div className="font-semibold text-yellow-900">Good</div>
                  <div className="text-sm text-yellow-700">Solid sustainability performance</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center text-white font-bold">
                  40+
                </div>
                <div>
                  <div className="font-semibold text-orange-900">Fair</div>
                  <div className="text-sm text-orange-700">Moderate sustainability</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center text-white font-bold">
                  &lt;40
                </div>
                <div>
                  <div className="font-semibold text-red-900">Poor</div>
                  <div className="text-sm text-red-700">Consider alternatives</div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Data Sources */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="p-6 bg-slate-50">
          <h3 className="font-semibold text-slate-900 mb-3">Data Sources & Assumptions</h3>
          <div className="text-sm text-slate-600 space-y-2">
            <p>
              Material data is compiled from industry standards, life cycle assessments (LCA), and
              environmental product declarations (EPD). Values represent typical conditions and may
              vary based on:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Manufacturing processes and geographic location</li>
              <li>Transportation distances and methods</li>
              <li>Installation techniques and local climate</li>
              <li>Maintenance practices and building design</li>
            </ul>
            <p className="mt-4">
              <strong>Note:</strong> This tool provides comparative analysis for decision support.
              For detailed specifications and compliance verification, consult material manufacturers,
              local building authorities, and sustainability consultants.
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
