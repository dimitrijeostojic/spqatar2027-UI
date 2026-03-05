import React from 'react'
import { Stadium } from '../types';
import { Badge } from './common';

const StadiumCard = ({ stadium }: { stadium: Stadium }) => {
  return (
    <div style={{ background: "var(--white)", border: "1px solid var(--sand-dark)", borderRadius: 6, overflow: "hidden", boxShadow: "var(--shadow-sm)" }}>
      <div style={{ height: 6, background: "linear-gradient(90deg, var(--maroon), var(--gold))" }} />
      <div style={{ padding: "1.25rem" }}>
        <h3 style={{ fontSize: "1rem", marginBottom: 6, color: "var(--ink)" }}>{stadium.stadiumName}</h3>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Badge color="gray">📍 {stadium.city}</Badge>
          <Badge color="gold">⚡ {stadium.capacity.toLocaleString()} mesta</Badge>
        </div>
      </div>
    </div>
  );
}

export default StadiumCard