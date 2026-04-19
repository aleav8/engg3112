import { useState, useEffect } from "react";
import { Trash2, Download, FolderOpen, Calendar, Layers } from "lucide-react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";
import { Project } from "../types/material";
import { toast } from "sonner";
import { motion } from "motion/react";
import { getScoreColor, getScoreLabel } from "../utils/materialAnalysis";

export function SavedProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = () => {
    const saved = localStorage.getItem("projects");
    if (saved) {
      const parsed = JSON.parse(saved);
      // Sort by date descending
      parsed.sort((a: Project, b: Project) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setProjects(parsed);
    }
  };

  const deleteProject = (id: string) => {
    const updated = projects.filter((p) => p.id !== id);
    localStorage.setItem("projects", JSON.stringify(updated));
    setProjects(updated);
    setDeleteId(null);
    toast.success("Project deleted");
  };

  const exportProject = (project: Project) => {
    const exportData = {
      projectName: project.name,
      date: project.date,
      materials: project.results.map((r) => ({
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
    a.download = `${project.name.replace(/\s+/g, "-").toLowerCase()}-${new Date(project.date).toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast.success(`Exported "${project.name}"`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">Saved Projects</h1>
        <p className="text-slate-600">
          Access and manage your previously saved material analyses
        </p>
      </motion.div>

      {/* Projects List */}
      {projects.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {projects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
            >
              <Card className="p-6 hover:shadow-lg transition-shadow">
                {/* Project Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-3 flex-1 min-w-0">
                    <div className="w-12 h-12 bg-pink-accent-background rounded-lg flex items-center justify-center flex-shrink-0">
                      <FolderOpen className="w-6 h-6 text-pink-accent" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-900 text-lg truncate">
                        {project.name}
                      </h3>
                      <div className="flex items-center space-x-2 text-sm text-slate-500 mt-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(project.date)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Project Stats */}
                <div className="bg-slate-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2 text-sm text-slate-600">
                      <Layers className="w-4 h-4" />
                      <span>{project.results.length} Materials Analyzed</span>
                    </div>
                  </div>

                  {/* Top 3 Materials */}
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-slate-700 mb-2">Top Recommendations:</p>
                    {project.results.slice(0, 3).map((result, idx) => (
                      <div
                        key={result.material.id}
                        className="flex items-center justify-between bg-white rounded p-2"
                      >
                        <div className="flex items-center space-x-2 flex-1 min-w-0">
                          <Badge
                            variant="outline"
                            className="flex-shrink-0 w-6 h-6 p-0 justify-center"
                          >
                            {idx + 1}
                          </Badge>
                          <span className="text-sm text-slate-900 truncate">
                            {result.material.name}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 ml-2">
                          <span className={`text-sm font-semibold ${getScoreColor(result.score)}`}>
                            {result.score}
                          </span>
                          <span className="text-xs text-slate-500">
                            {getScoreLabel(result.score)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => exportProject(project)}
                    className="flex-1"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDeleteId(project.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="p-12 text-center">
            <FolderOpen className="w-16 h-16 mx-auto text-slate-300 mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No Saved Projects</h3>
            <p className="text-slate-500 max-w-md mx-auto">
              Projects you save from the dashboard will appear here. Start analyzing materials and
              save your work to access it later.
            </p>
          </Card>
        </motion.div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the project from your saved
              projects.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && deleteProject(deleteId)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
