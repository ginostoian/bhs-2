import { clamp, round } from "./common.js";

// Room heat requirement using the volume method common to UK radiator sizing guides:
// BTU/h = room volume (ft³) × room factor, adjusted for insulation, exposure and glazing.
// For heat pumps the radiator must be sized at a lower flow temperature, so we also show the
// catalogue (ΔT50) output to look for.
export const BTU_ROOM_TYPES = [
  { id: "living", label: "Living room", factor: 5 },
  { id: "dining", label: "Dining room", factor: 5 },
  { id: "bedroom", label: "Bedroom", factor: 4 },
  { id: "kitchen", label: "Kitchen", factor: 4 },
  { id: "bathroom", label: "Bathroom", factor: 6 },
  { id: "study", label: "Study or office", factor: 5 },
  { id: "hallway", label: "Hallway or landing", factor: 4 },
  { id: "conservatory", label: "Conservatory", factor: 7 },
];

export const BTU_INSULATION = [
  { id: "excellent", label: "New build or fully insulated", hint: "Post-2010, cavity and loft insulation, modern glazing.", factor: 0.8 },
  { id: "good", label: "Well insulated", hint: "Double glazing, loft and cavity insulation.", factor: 0.9 },
  { id: "average", label: "Average", hint: "Some insulation, double glazing.", factor: 1.0 },
  { id: "poor", label: "Draughty or solid walls", hint: "Victorian solid walls, older windows.", factor: 1.25 },
];

export const BTU_HEAT_SOURCES = [
  { id: "boiler", label: "Gas or oil boiler", hint: "Radiators run hot (around 70°C).", dt50Factor: 1 },
  { id: "heatPump", label: "Heat pump", hint: "Radiators run cooler (around 45°C), so they need to be bigger.", dt50Factor: 1.9 },
  { id: "electric", label: "Electric radiator", hint: "Rated output is what you get.", dt50Factor: 1 },
];

const WATTS_PER_BTU = 1 / 3.412;

export function estimateBtu(inputs) {
  const length = clamp(inputs.length || 4, 1, 30);
  const width = clamp(inputs.width || 3.5, 1, 30);
  const height = clamp(inputs.height || 2.4, 2, 6);
  const room = BTU_ROOM_TYPES.find((r) => r.id === inputs.roomType) || BTU_ROOM_TYPES[0];
  const insulation = BTU_INSULATION.find((r) => r.id === inputs.insulation) || BTU_INSULATION[2];
  const source = BTU_HEAT_SOURCES.find((r) => r.id === inputs.heatSource) || BTU_HEAT_SOURCES[0];

  const volumeFt3 = length * width * height * 35.315;
  const externalWalls = clamp(inputs.externalWalls ?? 1, 0, 4);
  const windows = clamp(inputs.windows ?? 1, 0, 8);

  let factor = insulation.factor;
  factor *= 1 + (externalWalls - 1) * 0.1;
  factor *= 1 + Math.max(0, windows - 1) * 0.05;
  if (inputs.northFacing) factor *= 1.15;
  if (inputs.singleGlazed) factor *= 1.15;
  if (inputs.coldFloor) factor *= 1.1;

  const btu = round(volumeFt3 * room.factor * factor, 50);
  const watts = round(btu * WATTS_PER_BTU, 10);
  const ratedWatts = round(watts * source.dt50Factor, 10);
  const radiators = ratedWatts > 3200 ? 3 : ratedWatts > 1800 ? 2 : 1;

  return {
    btu,
    watts,
    ratedWatts,
    radiators,
    perRadiatorWatts: round(ratedWatts / radiators, 10),
    perRadiatorBtu: round((ratedWatts / radiators) / WATTS_PER_BTU, 50),
    area: Math.round(length * width * 10) / 10,
    volume: Math.round(length * width * height * 10) / 10,
    heatPump: source.id === "heatPump",
  };
}
