import React from 'react'

const HeroStat = ({ label, value }: { label: string; value: string | number }) => {
  return (
    <div>
      <div style={{ fontSize: ".62rem", letterSpacing: ".12em", textTransform: "uppercase", color: "rgba(245,230,200,.5)", marginBottom: 3 }}>{label}</div>
      <div style={{ fontSize: "1rem", color: "var(--sand-light)", fontWeight: 600 }}>{value}</div>
    </div>
  );
}

export default HeroStat