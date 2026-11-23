import { useMemo, useState } from 'react';
import { Trie } from '../../DataStructures/Trie';
import { toTitleCase } from '../../Helpers/formatters';
import styles from './TeamPicker.module.scss';

const TeamPicker = ({ value, onChange, teams, leagues, leagueId, onLeagueChange, isNewTeam, errors }) => {
  const [open, setOpen] = useState(false);

  const trie = useMemo(() => {
    const index = new Trie();
    teams.forEach((team) => index.insertWords(team.name, team));
    return index;
  }, [teams]);

  const leagueName = (id) => toTitleCase(leagues.find((league) => league.id === id)?.name ?? '');

  const suggestions = value.trim() ? trie.searchByPrefix(value.trim()).slice(0, 8) : [];

  const pick = (team) => {
    onChange(toTitleCase(team.name));
    setOpen(false);
  };

  return (
    <div className={styles.picker}>
      <label>
        Equipo
        <input
          value={value}
          placeholder="Escribe para buscar o crear un equipo"
          onChange={(event) => {
            onChange(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          aria-invalid={Boolean(errors.teamName)}
        />
      </label>

      {open && suggestions.length > 0 && (
        <ul className={styles.suggestions}>
          {suggestions.map((team) => (
            <li key={team.id}>
              <button type="button" onMouseDown={() => pick(team)}>
                {toTitleCase(team.name)}
                <span>{leagueName(team.parent_id)}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {errors.teamName && (
        <span className={styles.error} data-error="true">
          {errors.teamName}
        </span>
      )}

      {isNewTeam && (
        <div className={styles.newTeam}>
          {suggestions.length > 0 && (
            <div className={styles.similar}>
              <p>
                No hay un equipo llamado exactamente <strong>{toTitleCase(value)}</strong>. ¿Es alguno de estos?
              </p>
              <div className={styles.chips}>
                {suggestions.map((team) => (
                  <button key={team.id} type="button" onClick={() => pick(team)}>
                    {toTitleCase(team.name)}
                  </button>
                ))}
              </div>
            </div>
          )}
          <p>
            {suggestions.length > 0 ? (
              'Si es un equipo distinto, elige la liga donde se va a crear:'
            ) : (
              <>
                <strong>{toTitleCase(value)}</strong> es un equipo nuevo. Elige la liga donde se va a crear:
              </>
            )}
          </p>
          <select value={leagueId} onChange={(event) => onLeagueChange(event.target.value)}>
            <option value="">Selecciona la liga</option>
            {leagues.map((league) => (
              <option key={league.id} value={league.id}>
                {toTitleCase(league.name)}
              </option>
            ))}
          </select>
          {errors.leagueId && (
            <span className={styles.error} data-error="true">
              {errors.leagueId}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default TeamPicker;
