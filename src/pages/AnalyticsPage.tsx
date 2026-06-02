import { useEffect, useState } from 'react';
import { fetchRequestsByCategory, fetchRequestsByDepartment, fetchPriorityDistribution, fetchSlaBreachTrend, fetchAverageResolutionTime, fetchMonthlyVolume } from '../services/analyticsService';
import { CategoryMetric, DepartmentMetric, PriorityMetric, TrendMetric, MonthlyVolume } from '../types/analytics.types';
import { CategoryChart } from '../components/charts/CategoryChart';
import { DepartmentChart } from '../components/charts/DepartmentChart';
import { PriorityChart } from '../components/charts/PriorityChart';
import { SlaTrendChart } from '../components/charts/SlaTrendChart';
import { MonthlyVolumeChart } from '../components/charts/MonthlyVolumeChart';

export function AnalyticsPage() {
  const [categoryData, setCategoryData] = useState<CategoryMetric[]>([]);
  const [departmentData, setDepartmentData] = useState<DepartmentMetric[]>([]);
  const [priorityData, setPriorityData] = useState<PriorityMetric[]>([]);
  const [trendData, setTrendData] = useState<TrendMetric[]>([]);
  const [resolutionData, setResolutionData] = useState<CategoryMetric[]>([]);
  const [volumeData, setVolumeData] = useState<MonthlyVolume[]>([]);

  useEffect(() => {
    const load = async () => {
      setCategoryData(await fetchRequestsByCategory());
      setDepartmentData(await fetchRequestsByDepartment());
      setPriorityData(await fetchPriorityDistribution());
      setTrendData(await fetchSlaBreachTrend());
      setResolutionData(await fetchAverageResolutionTime());
      setVolumeData(await fetchMonthlyVolume());
    };
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900/95">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Analytics</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">Operational insights</h2>
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <CategoryChart data={categoryData} />
        <DepartmentChart data={departmentData} />
        <PriorityChart data={priorityData} />
        <SlaTrendChart data={trendData} />
        <MonthlyVolumeChart data={volumeData} />
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900/95">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Resolution averages</h3>
          <div className="mt-6 space-y-4">
            {resolutionData.length ? (
              resolutionData.map((row: any) => (
                <div key={row.category} className="rounded-3xl bg-slate-50 p-4 dark:bg-slate-950/80">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{row.category}</span>
                    <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{row.count}h</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400">Loading resolution metrics...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
