import React, { useState, useMemo, useCallback } from "react";
import LeadCardOptimized from "./LeadCardOptimized";
import FiltersPanelOptimized from "../common/FiltersPanelOptimized";
import { useAppContext } from "../../context/AppContext";
import { Filters } from "../common/optimizedFilterUtils";
import "./LeadsPage.css";

const LeadsPageOptimized: React.FC = () => {
  const { leads } = useAppContext();
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<Filters>({
    location: [],
    scoreRange: null,
  });

  const toggleFilters = useCallback(() => {
    setShowFilters((prev) => !prev);
  }, []);

  const applyFilters = useCallback((filters: Filters) => {
    setSelectedFilters(filters);
    setShowFilters(false);
  }, []);

  const cancelFilters = useCallback(() => {
    setShowFilters(false);
  }, []);

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      let locationMatch = true;
      if (selectedFilters.location.length > 0) {
        locationMatch = selectedFilters.location.includes(lead.location);
      }

      let scoreMatch = true;
      if (selectedFilters.scoreRange !== null) {
        if (lead.score === null || lead.score === undefined) {
          scoreMatch = false;
        } else if (selectedFilters.scoreRange === "ge70") {
          scoreMatch = lead.score >= 70;
        } else if (selectedFilters.scoreRange === "lt70") {
          scoreMatch = lead.score < 70;
        }
      }

      return locationMatch && scoreMatch;
    });
  }, [leads, selectedFilters]);

  const appliedFilterCount = useMemo(() => {
    return (
      (selectedFilters.location.length > 0 ? 1 : 0) +
      (selectedFilters.scoreRange !== null ? 1 : 0)
    );
  }, [selectedFilters]);

  const filterButton = useMemo(() => (
    <button
      className="btn btn-secondary filters-button"
      onClick={toggleFilters}>
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
          d="M22 3H2L10 12.46V19L14 21V12.46L22 3Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span>Filters</span>
      {appliedFilterCount > 0 && (
        <span className="filters-count">{appliedFilterCount}</span>
      )}
    </button>
  ), [toggleFilters, appliedFilterCount]);

  const leadsList = useMemo(() => (
    <div className="leads-list">
      {filteredLeads.length > 0 ? (
        filteredLeads.map((lead) => <LeadCardOptimized key={lead.id} lead={lead} />)
      ) : (
        <p className="no-leads-message">
          No leads match the current filters.
        </p>
      )}
    </div>
  ), [filteredLeads]);

  return (
    <div className="leads-page">
      <div className="leads-header">
        <div className="filters-button-container">
          {filterButton}
          {showFilters && (
            <FiltersPanelOptimized
              selectedFilters={selectedFilters}
              onApply={applyFilters}
              onCancel={cancelFilters}
            />
          )}
        </div>
      </div>
      {leadsList}
    </div>
  );
};

export default React.memo(LeadsPageOptimized);
