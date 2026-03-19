"use client";

interface ResumeFeedbackProps {
  postCorrections: string[];
  qualityFlags: string[];
}

export default function ResumeFeedback({ postCorrections, qualityFlags }: ResumeFeedbackProps) {
  if (postCorrections.length === 0 && qualityFlags.length === 0) return null;

  return (
    <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 space-y-4">
      <h3 className="text-sm font-semibold text-white">O que foi alterado e melhorado</h3>

      {postCorrections.length > 0 && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3">
          <p className="text-xs font-medium text-emerald-400 mb-1.5">{"\u2705"} Correções aplicadas</p>
          <ul className="space-y-1">
            {postCorrections.map((item, i) => (
              <li key={i} className="text-xs text-emerald-300/80 pl-5">{item}</li>
            ))}
          </ul>
        </div>
      )}

      {qualityFlags.length > 0 && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
          <p className="text-xs font-medium text-yellow-400 mb-1.5">{"\u26A0\uFE0F"} Pontos de atenção</p>
          <ul className="space-y-1">
            {qualityFlags.map((item, i) => (
              <li key={i} className="text-xs text-yellow-300/80 pl-5">{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
