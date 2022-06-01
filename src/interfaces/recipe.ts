export interface NewRecipe {
  slug: string;
  title: string;
  description: string;
  ingredients: string[];
  method: string[];
  ingredientsRows: number;
  methodRows: number;
}
