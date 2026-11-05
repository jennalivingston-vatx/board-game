import {
  Beef,
  Coffee,
  EggFried,
  Fish,
  Flame,
  Flower,
  Guitar,
  IceCreamCone,
  Martini,
  MicVocal,
  Mountain,
  Music,
  Radio,
  Sailboat,
  Trees,
  Waves,
  Droplets,
  Footprints,
} from 'lucide-react';

// The three candy colors. Each one leads to a different itinerary at the Capitol.
export const THEMES = {
  food: { label: 'Eat', color: '#f7941d', light: '#ffe6c7', dark: '#b35f00' },
  music: { label: 'Music', color: '#8e3a9d', light: '#f0dcf4', dark: '#5e1f6b' },
  outdoors: { label: 'Outdoors', color: '#3bb54a', light: '#d9f3d6', dark: '#1d7a2b' },
};

// The board, from Start (0) to the Capitol (19). Stops 1–18 come in six rounds of three:
// one food, one music and one outdoors stop per round. Each turn the player picks one of
// the next round's stops, so every game takes at most six picks.
// A `shortcut` sends the player ahead to that stop in the following round.
export const SPACES = [
  { name: 'Start' },
  // Round 1
  { theme: 'outdoors', name: 'Lady Bird Lake', blurb: 'Paddleboard past the downtown skyline.', icon: Sailboat, shortcut: { to: 5, label: 'Hike-and-Bike Trail shortcut!' } },
  { theme: 'food', name: 'Veracruz All Natural', blurb: 'The migas taco that made breakfast famous.', icon: EggFried },
  { theme: 'music', name: 'Continental Club', blurb: 'Swanky South Congress club, live music since 1955.', icon: Guitar },
  // Round 2
  { theme: 'food', name: "Amy's Ice Creams", blurb: 'Local scoops, tossed behind the counter.', icon: IceCreamCone },
  { theme: 'outdoors', name: 'Zilker Park', blurb: '350 acres of picnics, frisbee and skyline views.', icon: Trees },
  { theme: 'music', name: 'Broken Spoke', blurb: 'Two-step at a true Texas dance hall.', icon: Footprints },
  // Round 3
  { theme: 'music', name: 'Rainey Street', blurb: 'Bungalow bars with porches and patios.', icon: Martini, shortcut: { to: 12, label: 'Pedicab shortcut!' } },
  { theme: 'food', name: 'Franklin Barbecue', blurb: 'Brisket worth the line. Go early!', icon: Beef },
  { theme: 'outdoors', name: 'Mount Bonnell', blurb: 'About 100 steps up to the best sunset in town.', icon: Mountain },
  // Round 4
  { theme: 'food', name: 'Kerbey Lane Cafe', blurb: 'Queso and pancakes, a local favorite since 1980.', icon: Coffee, shortcut: { to: 15, label: 'Food truck express!' } },
  { theme: 'outdoors', name: 'Barton Springs Pool', blurb: 'Spring-fed swimming at about 68° all year.', icon: Waves },
  { theme: 'music', name: "Stubb's", blurb: 'Barbecue and big shows on an outdoor stage.', icon: MicVocal },
  // Round 5
  { theme: 'outdoors', name: 'Wildflower Center', blurb: 'Bluebonnets and native Texas gardens.', icon: Flower },
  { theme: 'music', name: 'ACL Live', blurb: 'Home of the Austin City Limits tapings.', icon: Radio },
  { theme: 'food', name: 'Uchi', blurb: 'Inventive sushi from a James Beard–winning chef.', icon: Fish },
  // Round 6
  { theme: 'music', name: 'Sixth Street', blurb: 'Neon, live bands and late nights downtown.', icon: Music },
  { theme: 'outdoors', name: 'McKinney Falls', blurb: 'Waterfalls and trails, minutes from downtown.', icon: Droplets },
  { theme: 'food', name: 'The Salt Lick', blurb: 'Open-pit barbecue out in Hill Country.', icon: Flame },
  { name: 'Texas State Capitol' },
];

export const FINISH = SPACES.length - 1;
export const ROUNDS = 6;

export const roundOf = (index) => Math.ceil(index / 3);
export const stopsInRound = (round) => [round * 3 - 2, round * 3 - 1, round * 3];

export const ITINERARIES = {
  food: {
    title: 'The Taco-to-Brisket Day',
    tagline: 'You ate your way across the board. Austin approves.',
    stops: [
      { time: 'Morning', what: 'Migas tacos at Veracruz All Natural', tip: 'Grab a seat outside and add a horchata.' },
      { time: 'Late morning', what: 'Line up at Franklin Barbecue', tip: 'Arrive early: they close when the brisket sells out.' },
      { time: 'Afternoon', what: 'South Congress food trucks and a scoop at Amy\'s Ice Creams', tip: 'Browse the SoCo shops between bites.' },
      { time: 'Evening', what: 'Dinner at Uchi', tip: 'Book ahead, or try for happy hour at the bar.' },
      { time: 'Bonus day trip', what: 'Family-style barbecue at The Salt Lick in Driftwood', tip: 'About 40 minutes into the Hill Country.' },
    ],
  },
  music: {
    title: 'The Live Music Crawl',
    tagline: 'You followed the music. Welcome to the Live Music Capital of the World.',
    stops: [
      { time: 'Morning', what: 'Dig through the racks at Waterloo Records', tip: 'Then snap a photo with the Stevie Ray Vaughan statue on Lady Bird Lake.' },
      { time: 'Afternoon', what: "Barbecue and a show at Stubb's", tip: 'Check the lineup for outdoor concerts on the big stage.' },
      { time: 'Early evening', what: 'Two-step lessons at the Broken Spoke', tip: 'No partner needed; the regulars will show you the steps.' },
      { time: 'Night', what: 'Catch a band at the Continental Club', tip: 'A South Congress classic since 1955.' },
      { time: 'Late night', what: 'Bar-hop Rainey Street and Sixth Street', tip: 'Hail a pedicab between stops.' },
    ],
  },
  outdoors: {
    title: 'Hill Country Fresh Air',
    tagline: 'You took the scenic route. Austin is better outside.',
    stops: [
      { time: 'Morning', what: 'Paddleboard or kayak Lady Bird Lake', tip: 'Calm water and skyline views before the heat.' },
      { time: 'Midday', what: 'Swim at Barton Springs Pool, then picnic in Zilker Park', tip: 'The spring water stays around 68° all year.' },
      { time: 'Afternoon', what: 'Wander the Lady Bird Johnson Wildflower Center', tip: 'Spring brings the bluebonnets.' },
      { time: 'Sunset', what: 'Climb Mount Bonnell', tip: 'About 100 steps to a view over the Colorado River.' },
      { time: 'Dusk', what: 'Watch the bats leave the Congress Avenue Bridge', tip: 'From March to October, around 1.5 million fly out at sunset.' },
    ],
  },
};

// The itinerary goes to the color the player landed on most. Ties go to the color they landed on last.
export function winningTheme(visits) {
  const counts = { food: 0, music: 0, outdoors: 0 };
  visits.forEach((i) => counts[SPACES[i].theme]++);
  const best = Math.max(...Object.values(counts));
  const tied = Object.keys(counts).filter((t) => counts[t] === best);
  const last = [...visits].reverse().find((i) => tied.includes(SPACES[i].theme));
  return { theme: SPACES[last].theme, counts };
}
