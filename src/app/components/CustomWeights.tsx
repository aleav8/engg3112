import { useState, useEffect } from "react";
import { Sliders, RotateCcw, Leaf, Heart, Shield } from "lucide-react";
import { Card } from "./ui/card";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { CustomWeights as WeightsType, DEFAULT_WEIGHTS } from "../utils/materialAnalysis";
import { motion } from "motion/react";

interface CustomWeightsProps {
  weights: WeightsType;
  onChange: (weights: WeightsType) => void;
}

export function CustomWeights({ weights, onChange }: CustomWeightsProps) {
  const [localWeights, setLocalWeights] = useState(weights);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setLocalWeights(weights);
  }, [weights]);

  const totalWeight = Object.values(localWeights).reduce((sum, val) => sum + val, 0);
  const isValid = totalWeight === 100;

  const handleWeightChange = (key: keyof WeightsType, value: number) => {
    const newWeights = { ...localWeights, [key]: value };
    setLocalWeights(newWeights);
    
    // Auto-apply if total equals 100
    const total = Object.values(newWeights).reduce((sum, val) => sum + val, 0);
    if (total === 100) {
      onChange(newWeights);
    }
  };

  const resetToDefaults = () => {
    setLocalWeights(DEFAULT_WEIGHTS);
    onChange(DEFAULT_WEIGHTS);
  };

  const normalizeWeights = () => {
    const total = Object.values(localWeights).reduce((sum, val) => sum + val, 0);
    if (total === 0) return;

    const normalized = {
      carbon: Math.round((localWeights.carbon / total) * 100),
      health: Math.round((localWeights.health / total) * 100),
      regulatory: Math.round((localWeights.regulatory / total) * 100),
    };

    // Adjust for rounding errors
    const newTotal = Object.values(normalized).reduce((sum, val) => sum + val, 0);
    if (newTotal !== 100) {
      normalized.carbon += 100 - newTotal;
    }

    setLocalWeights(normalized);
    onChange(normalized);
  };

  const weightConfig = [
    {
      key: "carbon" as keyof WeightsType,
      label: "Carbon Emissions",
      icon: Leaf,
      bgColor: "bg-carbon-background",
      iconColor: "text-carbon-accent",
      description: "Environmental impact and carbon footprint",
    },
    {
      key: "health" as keyof WeightsType,
      label: "Public Health",
      icon: Heart,
      bgColor: "bg-health-background",
      iconColor: "text-health-accent",
      description: "Urban heat, air quality, and safety",
    },
    {
      key: "regulatory" as keyof WeightsType,
      label: "Regulatory Compliance",
      icon: Shield,
      bgColor: "bg-regulatory-background",
      iconColor: "text-regulatory-accent",
      description: "Building codes and standards",
    },
  ];

  return (
    <Card className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Sliders className="w-5 h-5 text-pink-accent" />
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Custom Weighting</h2>
            <p className="text-sm text-slate-500">
              Adjust importance of each factor (must total 100%)
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge
            variant={isValid ? "default" : "destructive"}
            className={isValid ? "bg-emerald-600" : ""}
          >
            Total: {totalWeight}%
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="hidden sm:flex"
          >
            {isExpanded ? "Hide" : "Show"}
          </Button>
        </div>
      </div>

      {/* Compact View */}
      {!isExpanded && (
        <div className="grid grid-cols-3 gap-4">
          {weightConfig.map((config) => {
            const Icon = config.icon;
            return (
              <div key={config.key} className="text-center">
                <div className={`w-10 h-10 mx-auto mb-2 ${config.bgColor} rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${config.iconColor}`} />
                </div>
                <div className="text-2xl font-bold text-slate-900">
                  {localWeights[config.key]}%
                </div>
                <div className="text-xs text-slate-500">{config.label}</div>
              </div>
            );
          })}
        </div>
      )}

      {/* Expanded View */}
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="space-y-6"
        >
          {weightConfig.map((config) => {
            const Icon = config.icon;
            return (
              <div key={config.key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 ${config.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-4 h-4 ${config.iconColor}`} />
                    </div>
                    <div>
                      <Label className="text-sm font-semibold text-slate-900">
                        {config.label}
                      </Label>
                      <p className="text-xs text-slate-500">{config.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={localWeights[config.key]}
                      onChange={(e) =>
                        handleWeightChange(config.key, parseInt(e.target.value) || 0)
                      }
                      className="w-16 px-2 py-1 text-center border border-slate-300 rounded text-sm font-semibold"
                    />
                    <span className="text-sm text-slate-500 ml-1">%</span>
                  </div>
                </div>
                <Slider
                  value={[localWeights[config.key]]}
                  onValueChange={([value]) => handleWeightChange(config.key, value)}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>
            );
          })}

          <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-slate-200">
            <Button
              variant="outline"
              size="sm"
              onClick={resetToDefaults}
              className="flex-1"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset to Defaults
            </Button>
            {!isValid && (
              <Button
                variant="outline"
                size="sm"
                onClick={normalizeWeights}
                className="flex-1"
              >
                Auto-Normalize to 100%
              </Button>
            )}
          </div>
        </motion.div>
      )}

      {/* Mobile Toggle */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsExpanded(!isExpanded)}
        className="sm:hidden w-full mt-4"
      >
        {isExpanded ? "Hide Details" : "Show Details"}
      </Button>
    </Card>
  );
}