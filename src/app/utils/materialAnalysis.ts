import { Material, AnalysisResult } from "../types/material";

// Default scoring weights
export const DEFAULT_WEIGHTS = {
  carbon: 45,
  health: 35,
  regulatory: 20,
};

export interface CustomWeights {
  carbon: number;
  health: number;
  regulatory: number;
}

export function analyzeMaterials(
  materials: Material[],
  customWeights?: CustomWeights
): AnalysisResult[] {
  // Use custom weights or defaults
  const weights = customWeights || DEFAULT_WEIGHTS;

  // Convert percentages to decimals
  const weightDecimal = {
    carbon: weights.carbon / 100,
    health: weights.health / 100,
    regulatory: weights.regulatory / 100,
  };

  const results: AnalysisResult[] = materials.map((material) => {
    // Carbon score (0-100, higher is better)
    // Normalize: -1.0 to 2.0 range mapped to 0-100
    const carbonScore = Math.max(
      0,
      Math.min(100, ((2.0 - material.carbonEmission) / 3.0) * 100)
    );

    // Health score (average of three metrics, inverted so lower is better)
    const healthScore =
      100 -
      (material.urbanHeatIndex +
        material.airQualityImpact +
        material.constructionExposure) /
        3;

    // Regulatory score
    const regulatoryScore = material.regulatoryCompliance ? 100 : 0;

    // Overall score with custom weights
    const score =
      carbonScore * weightDecimal.carbon +
      healthScore * weightDecimal.health +
      regulatoryScore * weightDecimal.regulatory;

    return {
      material,
      score: Math.round(score * 10) / 10,
      breakdown: {
        carbonScore: Math.round(carbonScore * 10) / 10,
        healthScore: Math.round(healthScore * 10) / 10,
        regulatoryScore: Math.round(regulatoryScore * 10) / 10,
      },
    };
  });

  // Sort by score descending
  return results.sort((a, b) => b.score - a.score);
}

export function getScoreColor(score: number): string {
  if (score >= 75) return "text-green-600";
  if (score >= 50) return "text-yellow-600";
  return "text-red-600";
}

export function getScoreLabel(score: number): string {
  if (score >= 75) return "Excellent";
  if (score >= 60) return "Good";
  if (score >= 40) return "Fair";
  return "Poor";
}