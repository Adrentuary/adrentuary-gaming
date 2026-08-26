'use client';
import { useState } from 'react';

interface Inputs {
  strength: string;
  intellect: string;
  agility: string;
  will: string;
  power: string;
}

interface StatResult {
  label: string;
  key: string;
  value: string;
}

function calcStats(inputs: Inputs): StatResult[] {
  const s  = parseFloat(inputs.strength)  || 0;
  const i  = parseFloat(inputs.intellect) || 0;
  const ag = parseFloat(inputs.agility)   || 0;
  const w  = parseFloat(inputs.will)      || 0;
  const p  = parseFloat(inputs.power)     || 0;

  const raw: Record<string, number> = {
    'Dealer':         (((2*s)+(2*w)+p)*0.0075)/100,
    'Giver':          ((((2*s)+(2*w)+p)/200))/100,
    'Painbringer':    ((((2*s)+(2*w)+p)/400))/100,
    'Proof':          ((((2*s)+(2*ag)+p)/125))/100,
    'Defy':           ((((2*s)+(2*ag)+p)/250))/100,
    'Ward':           (((2*s)+(2*ag)+p)*0.012)/100,
    'Crit Striker':   ((2*ag)+(2*w)+p)*0.024,
    'Crit Hitter':    ((2*ag)+(2*w)+p)*0.02,
    'School Assailant':((2*ag)+(2*w)+p)/40,
    'School Striker': ((2*ag)+(2*w)+p)*0.02,
    'Defender':       ((2*i)+(2*w)+p)*0.024,
    'Blocker':        ((2*i)+(2*w)+p)*0.02,
    'Sniper':         (((2*i)+(2*ag)+p)*0.0075)/100,
    'Shot':           (((2*i)+(2*ag)+p)/200)/100,
    'Eye':            (((2*i)+(2*ag)+p)/400)/100,
    'Breaker':        ((((2*s)+(2*ag)+p)/400))/100,
    'Piercer':        ((((2*s)+(2*ag)+p)*0.0015))/100,
    'Stun Resist':    ((((2*s)+(2*i)+p)/250))/100,
    'Stun Recal':     ((((2*s)+(2*i)+p)/125))/100,
    'Lively':         (((2*i)+(2*ag)+p)*0.0065)/100,
    'Healer':         ((((2*s)+(2*w)+p)*0.003))/100,
    'Medic':          ((((2*s)+(2*w)+p)*0.0065))/100,
    'Healthy':        (((2*i)+(2*ag)+p)*0.003)/100,
  };

  return Object.entries(raw).map(([label, val]) => ({
    label,
    key: label,
    value: val > 0 && val < 1 ? (val * 100).toFixed(2) + '%' : val.toFixed(2),
  }));
}

export function PetCalculator() {
  const [inputs, setInputs] = useState<Inputs>({
    strength: '', intellect: '', agility: '', will: '', power: '',
  });
  const [results, setResults] = useState<StatResult[] | null>(null);

  function handleChange(field: keyof Inputs, value: string) {
    setInputs(prev => ({ ...prev, [field]: value }));
  }

  function handleCalculate() {
    setResults(calcStats(inputs));
  }

  const fields: { label: string; key: keyof Inputs; placeholder: string }[] = [
    { label: 'Strength',  key: 'strength',  placeholder: 'e.g. 255' },
    { label: 'Intellect', key: 'intellect', placeholder: 'e.g. 250' },
    { label: 'Agility',   key: 'agility',   placeholder: 'e.g. 260' },
    { label: 'Will',      key: 'will',      placeholder: 'e.g. 260' },
    { label: 'Power',     key: 'power',     placeholder: 'e.g. 250' },
  ];

  return (
    <div className="pet-calc">
      <div className="pet-calc__inputs">
        {fields.map(f => (
          <div className="pet-calc__field" key={f.key}>
            <label htmlFor={`pc-${f.key}`}>{f.label}</label>
            <input
              id={`pc-${f.key}`}
              type="number"
              placeholder={f.placeholder}
              value={inputs[f.key]}
              onChange={e => handleChange(f.key, e.target.value)}
            />
          </div>
        ))}
        <button className="button button--primary" type="button" onClick={handleCalculate}>
          Calculate
        </button>
      </div>

      <div className="pet-calc__results">
        {results ? (
          results.map(r => (
            <div className="pet-calc__row" key={r.key}>
              <span className="pet-calc__stat">{r.label}</span>
              <span className="pet-calc__val">{r.value}</span>
            </div>
          ))
        ) : (
          <p className="pet-calc__empty">Enter your pet&rsquo;s stats and hit Calculate to see results.</p>
        )}
      </div>
    </div>
  );
}
