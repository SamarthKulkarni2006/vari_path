import React from "react";
import { Activity, ArrowDown, Dna, Microscope, ScanLine } from "lucide-react";
import { VariantForm } from "@/components/form/VariantForm";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";

const steps = [
  { number: "01", title: "Describe the change", detail: "Gene, position, and amino acid substitution", icon: ScanLine },
  { number: "02", title: "Compare its properties", detail: "Review biochemical and sequence signals", icon: Microscope },
  { number: "03", title: "Explore the result", detail: "See a risk estimate with feature context", icon: Activity }
];

function MolecularAnimation() {
  const rungs = Array.from({ length: 15 }, (_, index) => index);

  return (
    <div className="molecule-panel" role="img" aria-label="Slowly rotating three-dimensional protein helix with a highlighted amino acid substitution">
      <div className="molecule-label"><span className="molecule-pulse" /> GENE → PROTEIN <span>3D MODEL</span></div>
      <div className="molecule-stage" aria-hidden="true">
        <div className="molecule-halo halo-a" /><div className="molecule-halo halo-b" />
        <div className="molecule-orbit"><i /><i /><i /></div>
        <div className="helix-scene"><div className="helix-model">
          {rungs.map((index) => <div className={`helix-rung ${index === 7 ? "helix-rung-highlight" : ""}`} key={index} style={{ top: `${index * 20}px`, transform: `translateZ(0) rotateY(${index * 29}deg)` }}><span className="helix-bead bead-left" /><span className="helix-bond" /><span className="helix-bead bead-right" /></div>)}
        </div></div>
        <div className="molecule-tag tag-residue"><span>RESIDUE 248</span><strong>R <b>→</b> W</strong><small>TP53 · MISSENSE</small></div>
        <div className="molecule-tag tag-signal"><span>PROPERTY SHIFT</span><strong>charged <i /> aromatic</strong></div>
        <div className="molecule-coordinate">TP53 <span>•</span> DNA → PROTEIN</div>
      </div>
    </div>
  );
}

export default function AnalyzePage() {
  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-mark"><Dna size={14} /></span> VARIPATH <span className="eyebrow-divider">/</span> GENOMIC VARIANT EXPLORER</div>
          <h1>Decode the Change.<br /><em>Understand the Risk.</em></h1>
          <p className="hero-description">Analyze genetic variants to predict their potential impact on protein function and disease risk through scientifically interpretable insights. Simplify complex genomic data to support research and informed clinical decision-making.</p>
          <div className="hero-actions">
            <InteractiveHoverButton text="Explore a variant" scrollTargetId="analyze" />
            <span className="hero-meta">A research and learning tool</span>
          </div>
          <div className="hero-rule" />
          <div className="hero-footnote"><span>01</span> INPUT A VARIANT <span className="footnote-line" /> <span>02</span> REVIEW THE EVIDENCE</div>
        </div>
        <MolecularAnimation />
        <div className="hero-index" aria-hidden="true">VP—01</div>
      </section>

      <section className="workflow-section" aria-label="How VariPath works">
        <div className="section-heading"><div><span className="section-kicker">A CLEARER WAY TO EXPLORE</span><h2>From substitution to signal.</h2></div><p>Three steps to move from a variant description to a result you can inspect.</p></div>
        <div className="workflow-grid">
          {steps.map(({ number, title, detail, icon: Icon }) => (
            <article className="workflow-item" key={number}>
              <div className="workflow-top"><span>{number}</span><Icon size={17} strokeWidth={1.7} /></div>
              <h3>{title}</h3><p>{detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="analyze" className="analyze-section">
        <div className="analyze-heading"><div><span className="section-kicker">THE VARIANT DESK</span><h2>Start with a substitution.</h2><p>Enter the reference residue and the proposed change to begin.</p></div><a href="#analyze" className="back-to-form"><ArrowDown size={14} /> YOUR INPUT</a></div>
        <VariantForm />
      </section>
    </div>
  );
}
