import { useState, useEffect } from "react";
import { Plus, Download, Save, BarChart3, X, RefreshCw } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { MaterialCard } from "../components/MaterialCard";
import { MaterialChart } from "../components/MaterialChart";
import { CustomWeights } from "../components/CustomWeights";
import { MATERIAL_DATABASE } from "../data/materials";
import { analyzeMaterials, DEFAULT_WEIGHTS, CustomWeights as WeightsType } from "../utils/materialAnalysis";
import { Material, Project } from "../types/material";
import { toast } from "sonner";
import { motion } from "motion/react";

export function Dashboard() {
  const [selectedMaterials, setSelectedMaterials] = useState<Material[]>([]);
  const [results, setResults] = useState<ReturnType<typeof analyzeMaterials>>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [showChart, setShowChart] = useState(false);
  const [customWeights, setCustomWeights] = useState<WeightsType>(DEFAULT_WEIGHTS);

  // Categories for filtering
  const categories = Array.from(new Set(MATERIAL_DATABASE.map((m) => m.category)));

  useEffect(() => {
    if (selectedMaterials.length > 0) {
      const analysisResults = analyzeMaterials(selectedMaterials, customWeights);
      setResults(analysisResults);
    } else {
      setResults([]);
    }
  }, [selectedMaterials, customWeights]);

  const handleWeightsChange = (newWeights: WeightsType) => {
    setCustomWeights(newWeights);
    toast.success("Weights updated - recalculating scores");
  };

  const addMaterial = (materialId: string) => {
    const material = MATERIAL_DATABASE.find((m) => m.id === materialId);
    if (material && !selectedMaterials.find((m) => m.id === materialId)) {
      setSelectedMaterials([...selectedMaterials, material]);
      toast.success(`Added ${material.name}`);
    }
  };

  const removeMaterial = (materialId: string) => {
    const material = selectedMaterials.find((m) => m.id === materialId);
    setSelectedMaterials(selectedMaterials.filter((m) => m.id !== materialId));
    if (material) {
      toast.info(`Removed ${material.name}`);
    }
  };

  const clearAll = () => {
    setSelectedMaterials([]);
    setResults([]);
    toast.info("Cleared all materials");
  };

  const saveProject = () => {
    if (!projectName.trim()) {
      toast.error("Please enter a project name");
      return;
    }

    const project: Project = {
      id: Date.now().toString(),
      name: projectName,
      date: new Date().toISOString(),
      materials: selectedMaterials.map((m) => ({
        name: m.name,
        quantity: 1,
        unit: "unit",
      })),
      results: results,
    };

    const savedProjects = JSON.parse(localStorage.getItem("projects") || "[]");
    savedProjects.push(project);
    localStorage.setItem("projects", JSON.stringify(savedProjects));

    toast.success(`Project "${projectName}" saved successfully!`);
    setShowSaveDialog(false);
    setProjectName("");
  };

  const exportResults = () => {
    if (results.length === 0) {
      toast.error("No results to export");
      return;
    }

    const exportData = {
      exportDate: new Date().toISOString(),
      materials: results.map((r) => ({
        name: r.material.name,
        category: r.material.category,
        overallScore: r.score,
        carbonEmission: r.material.carbonEmission,
        lifespan: r.material.lifespan,
        carbonScore: r.breakdown.carbonScore,
        healthScore: r.breakdown.healthScore,
        regulatoryScore: r.breakdown.regulatoryScore,
        regulatoryCompliance: r.material.regulatoryCompliance,
      })),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `material-analysis-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast.success("Results exported successfully!");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
          Material Sustainability Dashboard
        </h1>
        <p className="text-slate-600">
          Select materials to analyze and compare based on carbon emissions, lifespan, public health
          impact, and regulatory compliance.
        </p>
      </motion.div>

      {/* Material Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Select Materials</h2>
              <p className="text-sm text-slate-500">
                Choose materials to compare and analyze
              </p>
            </div>
            {selectedMaterials.length > 0 && (
              <Button variant="outline" size="sm" onClick={clearAll}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            )}
          </div>

          {/* Category Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
            {categories.map((category) => {
              const materialsInCategory = MATERIAL_DATABASE.filter(
                (m) => m.category === category
              );
              return (
                <div key={category} className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">{category}</Label>
                  <Select onValueChange={addMaterial}>
                    <SelectTrigger>
                      <SelectValue placeholder={`Select ${category}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {materialsInCategory.map((material) => (
                        <SelectItem
                          key={material.id}
                          value={material.id}
                          disabled={!!selectedMaterials.find((m) => m.id === material.id)}
                        >
                          {material.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              );
            })}
          </div>

          {/* Selected Materials */}
          {selectedMaterials.length > 0 && (
            <div>
              <Label className="text-sm font-semibold text-slate-700 mb-2 block">
                Selected Materials ({selectedMaterials.length})
              </Label>
              <div className="flex flex-wrap gap-2">
                {selectedMaterials.map((material) => (
                  <Badge
                    key={material.id}
                    variant="secondary"
                    className="pl-3 pr-2 py-1.5 text-sm"
                  >
                    {material.name}
                    <button
                      onClick={() => removeMaterial(material.id)}
                      className="ml-2 hover:bg-slate-300 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </Card>
      </motion.div>

      {/* Custom Weighting */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        <CustomWeights weights={customWeights} onChange={handleWeightsChange} />
      </motion.div>

      {/* Actions */}
      {results.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap gap-3"
        >
          <Button onClick={() => setShowSaveDialog(true)} variant="default">
            <Save className="w-4 h-4 mr-2" />
            Save Project
          </Button>
          <Button onClick={exportResults} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Results
          </Button>
          <Button onClick={() => setShowChart(!showChart)} variant="outline">
            <BarChart3 className="w-4 h-4 mr-2" />
            {showChart ? "Hide" : "Show"} Chart
          </Button>
        </motion.div>
      )}

      {/* Chart */}
      {showChart && results.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <MaterialChart results={results} />
        </motion.div>
      )}

      {/* Results */}
      {results.length > 0 ? (
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="text-2xl font-semibold text-slate-900 mb-1">
              Analysis Results
            </h2>
            <p className="text-slate-600">Ranked by overall sustainability score</p>
          </motion.div>
          <div className="space-y-4">
            {results.map((result, idx) => (
              <MaterialCard key={result.material.id} result={result} rank={idx + 1} />
            ))}
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="p-12 text-center">
            <Plus className="w-16 h-16 mx-auto text-slate-300 mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              Select Materials to Begin
            </h3>
            <p className="text-slate-500 max-w-md mx-auto">
              Choose materials from the categories above to compare their sustainability metrics
              and find the best option for your project.
            </p>
          </Card>
        </motion.div>
      )}

      {/* Save Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Project</DialogTitle>
            <DialogDescription>
              Give your project a name to save the current analysis for later reference.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="project-name" className="mb-2 block">
              Project Name
            </Label>
            <Input
              id="project-name"
              placeholder="e.g., Office Building Renovation"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && saveProject()}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
              Cancel
            </Button>
            <Button onClick={saveProject}>Save Project</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}