import { useEffect, useState } from "react";
import { Stadium, Team } from "../types/entities/entities";
import { stadiumsApi, teamsApi } from "../api";
import { Spinner, ErrorMsg } from "../components/common";
import StadiumCard from "../components/StadiumCard";
import HeroStat from "../components/HeroStat";


export function HomePage() {
  const [stadiums, setStadiums] = useState<Stadium[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

useEffect(() => {
  Promise.all([stadiumsApi.getAll(), teamsApi.getAll()])
    .then(([stadiumData, teamData]) => {
      setStadiums(Array.isArray(stadiumData) ? stadiumData : (stadiumData as any).items ?? []);
      setTeams(Array.isArray(teamData) ? teamData : (teamData as any).items ?? []);
    })
    .catch(() => setError("Greška pri učitavanju podataka."))
    .finally(() => setLoading(false));
}, []);

  return (
    <div className="fade-in">
      <div style={{ background: "linear-gradient(135deg, var(--maroon-dark) 0%, var(--maroon) 60%, #a02030 100%)", padding: "3rem 2.5rem", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(45deg, rgba(201,150,42,.06) 0, rgba(201,150,42,.06) 1px, transparent 0, transparent 50%)", backgroundSize: "28px 28px" }} />
        <div style={{ position: "relative" }}>
          <p style={{ fontSize: ".65rem", letterSpacing: ".22em", textTransform: "uppercase", color: "var(--gold-light)", marginBottom: "0.75rem" }}>FIBA World Cup</p>
          <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: "clamp(2.5rem, 5vw, 4rem)", color: "var(--sand-light)", lineHeight: 1.05 }}>Qatar 2027</h1>
          <div style={{ width: 60, height: 3, background: "var(--gold)", margin: "1rem 0" }} />
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem", marginTop: "1.5rem" }}>
            <HeroStat label="Zemlja domaćin" value="🇶🇦 Katar" />
            <HeroStat label="Period" value="Jun – Jul 2027" />
            <HeroStat label="Timova" value={teams.length || "—"} />
            <HeroStat label="Stadiona" value={stadiums.length || "—"} />
          </div>
        </div>
      </div>

      <div style={{ padding: "2rem 2.5rem" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "1.4rem", color: "var(--maroon)" }}>Stadioni</h2>
          <span style={{ fontSize: ".7rem", color: "var(--muted)", letterSpacing: ".06em" }}>DOMAĆINI UTAKMICA</span>
        </div>

        {loading && <Spinner />}
        {error && <ErrorMsg message={error} />}

        {!loading && !error && (
          stadiums.length === 0 
            ? <p style={{ color: "var(--muted)", fontSize: ".85rem" }}>Nema evidentiranih stadiona.</p>
            : <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
              {stadiums.map(s => <StadiumCard key={s.publicId} stadium={s} />)}
            </div>
        )}
      </div>
    </div>
  );
}
