import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { TaskFilters, TaskSort } from '../types/filters';
import { parseUrlParams, buildUrlParams } from '../utils/urlParams';

export function useFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<TaskFilters>(() => {
    const params = parseUrlParams(searchParams);
    return params.filters;
  });
  const [sort, setSort] = useState<TaskSort>(() => {
    const params = parseUrlParams(searchParams);
    return params.sort;
  });

  // Sync URL params when filters or sort change
  useEffect(() => {
    const newParams = buildUrlParams(filters, sort);
    setSearchParams(newParams, { replace: true });
  }, [filters, sort, setSearchParams]);

  // Update filters/sort when URL changes (e.g., browser back/forward)
  useEffect(() => {
    const params = parseUrlParams(searchParams);
    setFilters(params.filters);
    setSort(params.sort);
  }, [searchParams]);

  const updateFilters = useCallback((newFilters: Partial<TaskFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const updateSort = useCallback((newSort: Partial<TaskSort>) => {
    setSort((prev) => ({ ...prev, ...newSort }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      statuses: [],
      priority: null,
      search: '',
    });
  }, []);

  return {
    filters,
    sort,
    updateFilters,
    updateSort,
    clearFilters,
  };
}

