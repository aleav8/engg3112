export interface Material {
  id: string;
  name: string;
  carbonEmission: number; // kg CO2e per kg
  lifespan: number; // years
  urbanHeatIndex: number; // 0-100 (lower is better)
  airQualityImpact: number; // 0-100 (lower is better)
  constructionExposure: number; // 0-100 (lower is better)
  regulatoryCompliance: boolean;
  requiredRegulations: string[];
  description: string;
  category: string;
}

export interface MaterialInput {
  name: string;
  quantity: number;
  unit: string;
}

export interface AnalysisResult {
  material: Material;
  score: number;
  breakdown: {
    carbonScore: number;
    healthScore: number;
    regulatoryScore: number;
  };
}

export interface Project {
  id: string;
  name: string;
  date: string;
  materials: MaterialInput[];
  results: AnalysisResult[];
}
