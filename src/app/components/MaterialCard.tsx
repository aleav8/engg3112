import { useState } from "react";
import { ChevronDown, ChevronUp, Leaf, Heart, Shield, AlertTriangle } from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { AnalysisResult } from "../types/material";
import { getScoreColor, getScoreLabel } from "../utils/materialAnalysis";
import { motion } from "motion/react";

interface MaterialCardProps {
  result: AnalysisResult;
  rank: number;
}

export function MaterialCard({ result, rank }: MaterialCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { material, score, breakdown } = result;

  const getRankBadgeColor = (rank: number) => {
    if (rank === 1) return "bg-amber-500";
    if (rank === 2) return "bg-slate-400";
    if (rank === 3) return "bg-orange-600";
    return "bg-slate-300";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: rank * 0.05 }}
    >
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        {/* Header */}
        <div className="p-4 sm:p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start space-x-3 flex-1">
              <div
                className={`w-10 h-10 rounded-full ${getRankBadgeColor(
                  rank
                )} flex items-center justify-center flex-shrink-0`}
              >
                <span className="text-white font-bold">#{rank}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-slate-900 text-lg">{material.name}</h3>
                <p className="text-sm text-slate-500">{material.category}</p>
              </div>
            </div>
            <div className="text-right ml-4">
              <div className={`text-2xl font-bold ${getScoreColor(score)}`}>{score}</div>
              <div className="text-xs text-slate-500">{getScoreLabel(score)}</div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="flex items-center space-x-2">
              <Leaf className="w-4 h-4 text-pink-accent flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-slate-500">Carbon</p>
                <p className="text-sm font-semibold text-slate-900 truncate">
                  {material.carbonEmission > 0 ? "+" : ""}
                  {material.carbonEmission} kg
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Heart className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-slate-500">Health</p>
                <p className="text-sm font-semibold text-slate-900 truncate">
                  {Math.round(breakdown.healthScore)}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-purple-600 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-slate-500">Compliant</p>
                <p className="text-sm font-semibold text-slate-900 truncate">
                  {material.regulatoryCompliance ? "Yes" : "No"}
                </p>
              </div>
            </div>
          </div>

          {!material.regulatoryCompliance && (
            <div className="flex items-start space-x-2 bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
              <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-amber-800">
                This material may not meet all regulatory requirements in your jurisdiction.
              </p>
            </div>
          )}

          {/* Expand Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full justify-center"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-4 h-4 mr-2" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4 mr-2" />
                Show Details
              </>
            )}
          </Button>
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-slate-200 bg-slate-50 p-4 sm:p-6"
          >
            <div className="space-y-4">
              {/* Description */}
              <div>
                <h4 className="text-sm font-semibold text-slate-900 mb-2">Description</h4>
                <p className="text-sm text-slate-600">{material.description}</p>
              </div>

              {/* Score Breakdown */}
              <div>
                <h4 className="text-sm font-semibold text-slate-900 mb-3">Score Breakdown</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-slate-600">Carbon Emissions</span>
                      <span className="text-xs font-semibold">{breakdown.carbonScore}/100</span>
                    </div>
                    <Progress value={breakdown.carbonScore} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-slate-600">Public Health</span>
                      <span className="text-xs font-semibold">{breakdown.healthScore}/100</span>
                    </div>
                    <Progress value={breakdown.healthScore} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-slate-600">Regulatory</span>
                      <span className="text-xs font-semibold">{breakdown.regulatoryScore}/100</span>
                    </div>
                    <Progress value={breakdown.regulatoryScore} className="h-2" />
                  </div>
                </div>
              </div>

              {/* Detailed Metrics */}
              <div>
                <h4 className="text-sm font-semibold text-slate-900 mb-3">Detailed Metrics</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-xs text-slate-500 mb-1">Urban Heat Index</p>

                    <p className="text-sm font-semibold flex items-center gap-1">
                      {material.urbanHeatIndex}/100

                      <span className="relative group cursor-pointer">
                        {/* Info icon */}
                        <span className="text-slate-400 text-xs">ⓘ</span>

                        {/* Tooltip */}
                        <span className="absolute left-full top-1/2 -translate-y-1/2 ml-2 w-max
                                        bg-slate-800 text-white text-[10px] rounded px-2 py-1
                                        opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          Lower is better

                          {/* Arrow */}
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full
                                          w-0 h-0 border-t-4 border-b-4 border-r-4
                                          border-t-transparent border-b-transparent border-r-slate-800" />
                        </span>
                      </span>
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-xs text-slate-500 mb-1">Air Quality Impact</p>
                    <p className="text-sm font-semibold">
                      {material.airQualityImpact}/100{" "}
                      
                      <span className="relative group cursor-pointer">
                        {/* Info icon */}
                        <span className="text-slate-400 text-xs">ⓘ</span>

                        {/* Tooltip */}
                        <span className="absolute left-full top-1/2 -translate-y-1/2 ml-2 w-max
                                        bg-slate-800 text-white text-[10px] rounded px-2 py-1
                                        opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          Lower is better

                          {/* Arrow */}
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full
                                          w-0 h-0 border-t-4 border-b-4 border-r-4
                                          border-t-transparent border-b-transparent border-r-slate-800" />
                        </span>
                      </span>

                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-xs text-slate-500 mb-1">Construction Exposure</p>
                    <p className="text-sm font-semibold">
                      {material.constructionExposure}/100{" "}
                      
                      <span className="relative group cursor-pointer">
                        {/* Info icon */}
                        <span className="text-slate-400 text-xs">ⓘ</span>

                        {/* Tooltip */}
                        <span className="absolute left-full top-1/2 -translate-y-1/2 ml-2 w-max
                                        bg-slate-800 text-white text-[10px] rounded px-2 py-1
                                        opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          Lower is better

                          {/* Arrow */}
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full
                                          w-0 h-0 border-t-4 border-b-4 border-r-4
                                          border-t-transparent border-b-transparent border-r-slate-800" />
                        </span>
                      </span>

                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-xs text-slate-500 mb-1">CO₂e Emissions</p>
                    <p className="text-sm font-semibold">
                      {material.carbonEmission > 0 ? "+" : ""}
                      {material.carbonEmission} kg CO₂e/kg {" "}

                      <span className="relative group cursor-pointer">
                        {/* Info icon */}
                        <span className="text-slate-400 text-xs">ⓘ</span>

                        {/* Tooltip */}
                        <span className="absolute left-full top-1/2 -translate-y-1/2 ml-2 w-max
                                        bg-slate-800 text-white text-[10px] rounded px-2 py-1
                                        opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          Lower is better

                          {/* Arrow */}
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full
                                          w-0 h-0 border-t-4 border-b-4 border-r-4
                                          border-t-transparent border-b-transparent border-r-slate-800" />
                        </span>
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Regulations */}
              <div>
                <h4 className="text-sm font-semibold text-slate-900 mb-2">Required Regulations</h4>
                <div className="flex flex-wrap gap-2">
                  {material.requiredRegulations.map((reg, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {reg}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </Card>
    </motion.div>
  );
}