export interface CocktailIngredient {
  name: string;
  amount: number;
  unit: string;
}

export interface CocktailRecipe {
  id: string;
  name: string;
  ingredients: CocktailIngredient[];
  garnish: string;
  instructions: string;
}

/** Classic cocktail recipes at 1-serving base amounts. */
export const COCKTAIL_RECIPES: CocktailRecipe[] = [
  {
    id: 'old-fashioned',
    name: 'Old Fashioned',
    ingredients: [
      { name: 'Bourbon or rye whiskey', amount: 2, unit: 'oz' },
      { name: 'Simple syrup', amount: 0.25, unit: 'oz' },
      { name: 'Angostura bitters', amount: 2, unit: 'dash' },
    ],
    garnish: 'Orange twist',
    instructions: 'Stir all ingredients with ice, strain over a large ice cube.',
  },
  {
    id: 'margarita',
    name: 'Margarita',
    ingredients: [
      { name: 'Tequila', amount: 2, unit: 'oz' },
      { name: 'Lime juice', amount: 1, unit: 'oz' },
      { name: 'Triple sec', amount: 1, unit: 'oz' },
    ],
    garnish: 'Salt rim, lime wheel',
    instructions: 'Shake with ice, strain into a salt-rimmed glass over fresh ice.',
  },
  {
    id: 'negroni',
    name: 'Negroni',
    ingredients: [
      { name: 'Gin', amount: 1, unit: 'oz' },
      { name: 'Campari', amount: 1, unit: 'oz' },
      { name: 'Sweet vermouth', amount: 1, unit: 'oz' },
    ],
    garnish: 'Orange peel',
    instructions: 'Stir all ingredients with ice, strain over a large ice cube.',
  },
  {
    id: 'daiquiri',
    name: 'Daiquiri',
    ingredients: [
      { name: 'White rum', amount: 2, unit: 'oz' },
      { name: 'Lime juice', amount: 1, unit: 'oz' },
      { name: 'Simple syrup', amount: 0.75, unit: 'oz' },
    ],
    garnish: 'Lime wheel',
    instructions: 'Shake with ice, strain into a chilled coupe.',
  },
  {
    id: 'whiskey-sour',
    name: 'Whiskey Sour',
    ingredients: [
      { name: 'Bourbon whiskey', amount: 2, unit: 'oz' },
      { name: 'Lemon juice', amount: 0.75, unit: 'oz' },
      { name: 'Simple syrup', amount: 0.75, unit: 'oz' },
      { name: 'Egg white (optional)', amount: 0.5, unit: 'oz' },
    ],
    garnish: 'Angostura bitters, cherry',
    instructions: 'Dry shake, then shake again with ice, strain over fresh ice.',
  },
  {
    id: 'martini',
    name: 'Martini',
    ingredients: [
      { name: 'Gin', amount: 2.5, unit: 'oz' },
      { name: 'Dry vermouth', amount: 0.5, unit: 'oz' },
    ],
    garnish: 'Lemon twist or olive',
    instructions: 'Stir with ice, strain into a chilled martini glass.',
  },
  {
    id: 'mojito',
    name: 'Mojito',
    ingredients: [
      { name: 'White rum', amount: 2, unit: 'oz' },
      { name: 'Lime juice', amount: 1, unit: 'oz' },
      { name: 'Simple syrup', amount: 0.75, unit: 'oz' },
      { name: 'Mint leaves', amount: 8, unit: 'leaves' },
      { name: 'Soda water', amount: 2, unit: 'oz' },
    ],
    garnish: 'Mint sprig',
    instructions: 'Muddle mint with syrup and lime, add rum and ice, top with soda water.',
  },
  {
    id: 'moscow-mule',
    name: 'Moscow Mule',
    ingredients: [
      { name: 'Vodka', amount: 2, unit: 'oz' },
      { name: 'Lime juice', amount: 0.5, unit: 'oz' },
      { name: 'Ginger beer', amount: 4, unit: 'oz' },
    ],
    garnish: 'Lime wheel, mint sprig',
    instructions: 'Build over ice in a copper mug, top with ginger beer.',
  },
];
