export interface CategoryMetric {
  category: string;
  count: number;
}

export interface DepartmentMetric {
  department: string;
  count: number;
}

export interface PriorityMetric {
  priority: string;
  count: number;
}

export interface TrendMetric {
  label: string;
  value: number;
}

export interface MonthlyVolume {
  month: string;
  count: number;
}
