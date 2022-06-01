<script setup lang="ts">
import { useRecipesStore } from "@/stores/recipes";
import { reactive } from "vue";
import type { NewRecipe } from "@/interfaces/recipe";
const props = defineProps({
  recipe: {
    required: true,
    type: Object,
  },
});
const recipesStore = useRecipesStore();

const rec: NewRecipe = reactive(JSON.parse(JSON.stringify(props.recipe)));

const removeIngredient = (idx: number) => {
  rec.ingredients = rec.ingredients.filter((_, id) => id !== idx - 1);
  rec.ingredientsRows--;
};
const removeMethod = (idx: number) => {
  rec.method = rec.method.filter((_, id) => id !== idx - 1);
  rec.methodRows--;
};

const addNewIngredient = () => {
  rec.ingredientsRows++;
};

const addNewMethod = () => {
  rec.methodRows++;
};
</script>

<template>
  <div class="add-recipe-popup">
    <div class="popup-content">
      <h2>Edit {{ rec.title }}</h2>
      <form @submit.prevent="">
        <div class="group">
          <label>Title</label>
          <input type="text" v-model="rec.title" />
        </div>
        <div class="group">
          <label>Description</label>
          <textarea v-model="rec.description"></textarea>
        </div>
        <div class="group">
          <label>Ingredients</label>
          <div class="ingredient" v-for="i in rec.ingredientsRows" :key="i">
            <input type="text" v-model="rec.ingredients[i - 1]" />
            <div @click="removeIngredient(i)">X</div>
          </div>
          <button type="button" @click="addNewIngredient">Add Ingredient</button>
        </div>
        <div class="group">
          <label>Method</label>
          <div class="method" v-for="i in rec.methodRows" :key="i">
            <textarea v-model="rec.method[i - 1]"></textarea>
            <div @click="removeMethod(i)">X</div>
          </div>
          <button type="button" @click="addNewMethod">Add Step</button>
        </div>
        <div class="buttons">
          <button class="btn-save" type="submit" @click="$emit('saveEdit', rec)">
            Save
          </button>
          <button class="btn-save" type="submit" @click="$emit('cancelEdit')">
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
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
  margin-bottom: 1rem;
}
.popup-content .group textarea {
  height: 100px;
  resize: none;
}
.popup-content button[type="submit"] {
  margin-right: 1rem;
}

.buttons {
  display: flex;
  justify-content: flex-end;
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
</style>
