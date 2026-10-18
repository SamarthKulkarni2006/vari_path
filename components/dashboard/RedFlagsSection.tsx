import React from "react";
import { Zap, Droplets, Scale, Compass, Hash } from "lucide-react";
import { BiochemicalFeatures, RedFlag } from "@/types/variant";
import { RedFlagCard } from "./RedFlagCard";

export interface RedFlagsSectionProps {
  features: BiochemicalFeatures;
  redFlags: RedFlag[];
}

export const RedFlagsSection: React.FC<RedFlagsSectionProps> = ({
  features,
  redFlags
}) => {
  // Extract or fallback for each card
  const blosumFlag = redFlags.find((f) =>
    f.title.toLowerCase().includes("blosum")
  ) ?? {
    title: "BLOSUM62 Substitution Score",
    value: `${features.blosum62Score > 0 ? "+" : ""}${features.blosum62Score}.0`,
    label: features.blosumLabel,
    severity: (features.blosum62Score < -1 ? "high" : features.blosum62Score < 1 ? "medium" : "low") as "high" | "medium" | "low",
    description: "Relative log-odds substitution frequency across homologous protein domains."
  };

  const hydroFlag = redFlags.find((f) =>
    f.title.toLowerCase().includes("hydropathy")
  ) ?? {
    title: "Δ Hydropathy (Kyte-Doolittle)",
    value: `${features.hydropathyDelta > 0 ? "+" : ""}${features.hydropathyDelta.toFixed(1)}`,
    label: features.hydropathyLabel,
    severity: (Math.abs(features.hydropathyDelta) >= 3 ? "high" : Math.abs(features.hydropathyDelta) >= 1.5 ? "medium" : "low") as "high" | "medium" | "low",
    description: "Net change in residue hydrophobicity affecting fold stability and solubility."
  };

  const chargeFlag = redFlags.find((f) =>
    f.title.toLowerCase().includes("charge")
  ) ?? {
    title: "Electrostatic Change",
    value: `${features.chargeBefore} → ${features.chargeAfter}`,
    label: features.chargeLabel,
    severity: (features.chargeBefore !== features.chargeAfter ? "medium" : "low") as "high" | "medium" | "low",
    description: "Alteration in net formal charge impacting salt-bridge and ionic interactions."
  };

  const mwDeltaStr = `${features.molecularWeightDelta > 0 ? "+" : ""}${features.molecularWeightDelta.toFixed(2)} Da`;
  const relPosPct = Math.round(features.relativePosition * 100);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Biochemical Red Flags</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Key physicochemical and evolutionary deviations identified at this locus
          </p>
        </div>
      </div>

      {/* 3 Red Flag Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: BLOSUM62 */}
        <RedFlagCard
          title={blosumFlag.title}
          value={blosumFlag.value}
          label={features.blosumLabel}
          description={blosumFlag.description}
          severity={blosumFlag.severity}
          icon={<Hash className="w-4 h-4 text-emerald-600" />}
          tooltipText="BLOSUM62 quantifies how often these two amino acids swap across natural evolution. Negative scores reflect rare, disruptive mutations."
        />

        {/* Card 2: Hydropathy */}
        <RedFlagCard
          title={hydroFlag.title}
          value={hydroFlag.value}
          label={features.hydropathyLabel}
          description={hydroFlag.description}
          severity={hydroFlag.severity}
          icon={<Droplets className="w-4 h-4 text-blue-600" />}
          tooltipText="Kyte-Doolittle scale measures residue water affinity. Major positive or negative shifts frequently destabilize protein folding cores."
        />

        {/* Card 3: Electrostatic Change */}
        <RedFlagCard
          title={chargeFlag.title}
          value={chargeFlag.value}
          label={features.chargeLabel}
          description={chargeFlag.description}
          severity={chargeFlag.severity}
          icon={<Zap className="w-4 h-4 text-amber-500" />}
          tooltipText="Tracks ionization at pH 7.0. Swapping charged and uncharged residues disrupts catalytic active sites and electrostatic networks."
        />
      </div>

      {/* Stat Tiles: Δ Molecular Weight and Relative Residue Position */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Δ Molecular Weight */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              <Scale className="w-4 h-4 text-indigo-600" />
            </span>
            <div>
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                Δ Molecular Weight
              </span>
              <span className="text-lg font-bold text-slate-900 dark:text-white">
                {mwDeltaStr}
              </span>
            </div>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {Math.abs(features.molecularWeightDelta) > 25
              ? "Steric volume disparity"
              : "Moderate steric footprint"}
          </span>
        </div>

        {/* Relative Residue Position */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                <Compass className="w-4 h-4 text-purple-600" />
              </span>
              <div>
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  Relative Residue Position
                </span>
                <span className="text-lg font-bold text-slate-900 dark:text-white">
                  {relPosPct}% along sequence
                </span>
              </div>
            </div>
            <span className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400">
              {features.relativePosition.toFixed(2)}
            </span>
          </div>

          {/* Thin progress bar */}
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-purple-600 dark:bg-purple-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${relPosPct}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
