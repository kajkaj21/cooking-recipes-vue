<script setup lang="ts">
import { ref, reactive } from "vue";
import type { NewRecipe } from "@/interfaces/recipe";
import { useRecipesStore } from "@/stores/recipes";

const recipesStore = useRecipesStore();

let newRecipe: NewRecipe = reactive({
  slug: "",
  title: "",
  description: "",
  ingredients: [""],
  method: [""],
  ingredientsRows: 1,
  methodRows: 1,
});

const newRecipeToDefault = () => {
  newRecipe.slug = "";
  newRecipe.title = "";
  newRecipe.description = "";
  newRecipe.ingredients = [""];
  newRecipe.method = [""];
  newRecipe.ingredientsRows = 1;
  newRecipe.methodRows = 1;
};

const popupOpen = ref(false);

const openModal = () => {
  popupOpen.value = true;
};
const closeModal = () => {
  popupOpen.value = false;
  newRecipeToDefault();
};

const addNewIngredient = () => {
  newRecipe.ingredientsRows++;
};
const addNewStep = () => {
  newRecipe.methodRows++;
};

const addNewRecipe = () => {
  newRecipe.slug = newRecipe.title.toLowerCase().replace(/\s/g, "-");

  if (newRecipe.slug === "") {
    alert("Please enter a title");
    return;
  }

  recipesStore.addRecipe({ ...newRecipe });

  closeModal();
};

const removeIngredient = (idx: number) => {
  newRecipe.ingredients = newRecipe.ingredients.filter((_, id) => id !== idx - 1);
  newRecipe.ingredientsRows--;
};
const removeMethod = (idx: number) => {
  newRecipe.method = newRecipe.method.filter((_, id) => id !== idx - 1);
  newRecipe.methodRows--;
};

const deleteRecipe = (e: Event) => {
  const selectedRecipe = e.target as HTMLButtonElement;
  const selectedRecipeSlug = selectedRecipe.dataset.slug;
  recipesStore.recipes = recipesStore.recipes.filter(
    (recipe) => recipe.slug !== selectedRecipeSlug
  );
};
</script>

<template>
  <div class="home">
    <h1>My Recipes</h1>
    <button @click="openModal">Add new recipe</button>
    <div class="recipes">
      <div class="card" v-for="recipe in recipesStore.recipes" :key="recipe.slug">
        <h2>{{ recipe.title }}</h2>
        <p>{{ recipe.description }}</p>
        <div class="buttons-container">
          <router-link :to="`/recipe/${recipe.slug}`">
            <button>View recipe</button>
          </router-link>
          <button
            class="btn-remove"
            :data-slug="recipe.slug"
            @click="deleteRecipe($event)"
          >
            Remove recipe
          </button>
        </div>
      </div>
    </div>
    <div class="add-recipe-popup" v-if="popupOpen">
      <div class="popup-content">
        <h2>Add new recipe</h2>
        <form @submit.prevent="addNewRecipe">
          <div class="group">
            <label>Title</label>
            <input type="text" v-model="newRecipe.title" />
          </div>
          <div class="group">
            <label>Description</label>
            <textarea v-model="newRecipe.description"></textarea>
          </div>
          <div class="group">
            <label>Ingredients</label>
            <div class="ingredient" v-for="i in newRecipe.ingredientsRows" :key="i">
              <input type="text" v-model="newRecipe.ingredients[i - 1]" />
              <div @click="removeIngredient(i)">X</div>
            </div>
            <button type="button" @click="addNewIngredient">Add Ingredient</button>
          </div>
          <div class="group">
            <label>Method</label>
            <div class="method" v-for="i in newRecipe.methodRows" :key="i">
              <textarea v-model="newRecipe.method[i - 1]"></textarea>
              <div @click="removeMethod(i)">X</div>
            </div>
            <button type="button" @click="addNewStep">Add Step</button>
          </div>
          <button type="submit">Add Recipe</button>
          <button type="button" @click="closeModal">Close</button>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}
h1 {
  font-size: 3rem;
  margin-bottom: 32px;
}
.recipes {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}
.recipes .card {
  padding: 1rem;
  border-radius: 5px;
  margin: 1rem;
  background-color: #081c33;
}
.recipes .card h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
}
.recipes .card p {
  font-size: 1.125rem;
  line-height: 1.4;
  margin-bottom: 1rem;
}
.add-recipe-popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.add-recipe-popup .popup-content {
  background-color: #081c33;
  padding: 2rem;
  border-radius: 1rem;
  width: 100%;
  max-width: 768px;
  max-height: 75vh;
  overflow-y: auto;
}
.popup-content h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
}
.popup-content .group {
  margin-bottom: 1rem;
}
.popup-content .group label {
  display: block;
  margin-bottom: 0.5rem;
}
.popup-content .group input,
.popup-content .group textarea {
  display: block;
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 5px;
}
.popup-content .group textarea {
  height: 100px;
  resize: none;
}
.popup-content button[type="submit"] {
  margin-right: 1rem;
}

.ingredient,
.method {
  display: flex;
  gap: 3rem;
  align-items: center;
  margin-bottom: 1rem;
}

.ingredient div,
.method div {
  cursor: pointer;
  color: #a61d1d;
  font-weight: 700;
  font-size: 24px;
}

.buttons-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.btn-remove {
  background-color: transparent;
  border: #ccc solid 1px;
  color: #ccc;
  transition: 0.3s ease border;
}

.btn-remove:hover {
  border: #a61d1d solid 1px;
}
</style>
