import CalculatorPage from "@/components/calculators/CalculatorPage";
import { estimateBtu } from "@/libs/calculators/btu";

const ROOMS = [
  ["Small bedroom", "bedroom", 3, 2.7],
  ["Double bedroom", "bedroom", 4, 3.5],
  ["Living room", "living", 5, 4],
  ["Kitchen-diner", "dining", 6, 4.5],
  ["Bathroom", "bathroom", 2.5, 2],
];

export default function Page() {
  const rows = ROOMS.map(([label, roomType, length, width]) => {
    const boiler = estimateBtu({ roomType, length, width, height: 2.4, insulation: "average", heatSource: "boiler", externalWalls: 1, windows: 1 });
    const pump = estimateBtu({ roomType, length, width, height: 2.4, insulation: "average", heatSource: "heatPump", externalWalls: 1, windows: 1 });
    return [label, `${length} × ${width} m`, `${boiler.btu.toLocaleString("en-GB")} BTU (${boiler.watts.toLocaleString("en-GB")} W)`, `${pump.ratedWatts.toLocaleString("en-GB")} W`];
  });

  return (
    <CalculatorPage
      id="btu"
      service="Heating"
      eyebrow="Free calculator"
      title="BTU and radiator size calculator"
      intro="Work out how much heat a room needs in BTU and watts, how many radiators to fit and what size to buy. It also sizes radiators for heat pumps, which run cooler and need bigger radiators."
      points={["Any room, any insulation", "Heat pump sizing (ΔT50)", "Instant result"]}
      benchmark={{
        title: "Typical BTU by room",
        intro: "Rooms with 2.4 m ceilings, average insulation, one outside wall and one window.",
        columns: ["Room", "Size", "Heat needed (gas boiler)", "Radiator rating for a heat pump (ΔT50)"],
        rows,
      }}
      sections={[
        {
          title: "How the calculation works",
          body: (
            <p>
              We use the volume method common to UK radiator guides: room volume multiplied by a heat factor for the type of room, adjusted for insulation, outside walls, windows, aspect and cold floors. One watt is 3.412 BTU per hour.
            </p>
          ),
        },
        {
          title: "Sizing radiators for a heat pump",
          body: (
            <p>
              Radiator outputs are quoted at ΔT50, which assumes very hot water. Heat pumps run at around 45°C, where a radiator gives roughly half its rated output. So a heat pump room needs radiators rated at about twice the heat required. Your installer must do a full room-by-room heat loss survey for MCS, but this gets you close.
            </p>
          ),
        },
      ]}
      faqs={[
        { q: "How many BTU do I need for a room?", a: "As a rough guide, a well-insulated living room needs about 5 BTU per cubic foot of volume. A 5 × 4 m room with a 2.4 m ceiling needs around 8,500 BTU (2,500 W). Older, draughty rooms need more." },
        { q: "How do I convert BTU to watts?", a: "Divide BTU per hour by 3.412. For example, 6,800 BTU is about 2,000 watts." },
        { q: "What is ΔT50?", a: "It is the standard condition manufacturers use to rate radiators: the radiator is 50°C warmer than the room. At the lower temperatures used with heat pumps, output is much lower than the ΔT50 figure." },
        { q: "Should I have one radiator or two?", a: "Long rooms, rooms over about 1,800 W and rooms with several windows heat more evenly with two radiators, ideally under the windows." },
      ]}
    />
  );
}
