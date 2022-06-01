<script setup lang="ts">
import { useRoute } from "vue-router";
import { ref, computed } from "vue";
import { useRecipesStore } from "@/stores/recipes";
import type { NewRecipe } from "@/interfaces/recipe";
import AddRecipeModal from "@/components/AddRecipeModal.vue";
const route = useRoute();
const recipesStore = useRecipesStore();

const recipe = computed(() => {
  return recipesStore.recipes.find(
    (recipe) => recipe.slug === route.params.slug
  ) as NewRecipe;
});

const cleanText = (text: string) => {
  return text.replace(/\n/g, "<br />");
};

const showEdit = ref(false);

const editRecipe = () => {
  showEdit.value = true;
};

const saveEdit = (rec: NewRecipe) => {
  showEdit.value = false;
  const recipeId = recipesStore.recipes.findIndex(
    (recipe) => recipe.slug === rec.slug
  );
  recipesStore.recipes[recipeId].slug = rec.slug;
  recipesStore.recipes[recipeId].title = rec.title;
  recipesStore.recipes[recipeId].description = rec.description;
  recipesStore.recipes[recipeId].ingredients = rec.ingredients;
  recipesStore.recipes[recipeId].method = rec.method;
  recipesStore.recipes[recipeId].ingredientsRows = rec.ingredientsRows;
  recipesStore.recipes[recipeId].methodRows = rec.methodRows;
};
const cancelEdit = () => {
  showEdit.value = false;
};
</script>

<template>
  <AddRecipeModal
    :recipeSlug="recipe.slug"
    :recipe="recipe"
    v-if="showEdit"
    @saveEdit="saveEdit"
    @cancelEdit="cancelEdit"
  ></AddRecipeModal>
  <div class="recipe">
    <router-link to="/">&lt; Back</router-link>
    <h1>{{ recipe.title }}</h1>
    <p class="desc">{{ recipe.description }}</p>
    <hr />
    <div class="ingredients">
      <h3>Ingredients</h3>
      <ul>
        <li v-for="(ingredient, i) in recipe.ingredients" :key="i">
          {{ ingredient }}
        </li>
      </ul>
    </div>
    <div class="method">
      <h3>Method</h3>
      <ol>
        <li v-for="(step, i) in recipe.method" :key="i">
          <span v-html="cleanText(step)"></span>
        </li>
      </ol>
    </div>
    <button class="btn-edit" @click="editRecipe">Edit</button>
  </div>
</template>

<style>
.recipe {
  padding: 1rem;
  max-width: 768px;
  margin: 0 auto;
}
.desc {
  font-size: 1.125rem;
  line-height: 1.4;
  margin-bottom: 1rem;
}
hr {
  margin-bottom: 1rem;
}
h3 {
  margin-bottom: 1rem;
}
.ingredients {
  padding: 1rem;
  background-color: #081c33;
  border-radius: 0.5rem;
  margin-bottom: 2rem;
}
.ingredients ul li {
  list-style-position: inside;
  line-height: 1.4;
  margin-bottom: 1rem;
}
.method ol li {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  list-style-position: inside;
  border-bottom: 1px solid #eee;
}

.btn-edit {
  display: block;
  margin-left: auto;
}
</style>
