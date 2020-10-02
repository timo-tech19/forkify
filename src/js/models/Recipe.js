import axios from 'axios';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    async getRecipe() {
        try {
             const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
             this.title = res.data.recipe.title;
             this.author = res.data.recipe.publisher;
             this.img = res.data.recipe.image_url;
             this.url = res.data.recipe.source_url;
             this.ingredients = res.data.recipe.ingredients;
        } catch (error) {
            alert('Error: Something went wrong :(');
        }
    }

    calcTime() {
        // Assume for every 3 ing we need 15mins
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15;
    }

    calcServings() {
        this.servings = 4;
    }

    parseIngredients() {
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const units = [...unitsShort, 'kg', 'g'];

        const newIngredients = this.ingredients.map(el => {
            // Uniform units
            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i]);
            });

            // Remove paranthesis
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');
            
            // Parse ingredients into count unit and ingredients
            const arrIng = ingredient.split(' ');
            const unitIndex = arrIng.findIndex(unit => units.includes(unit));

            let ObjIng;
            if(unitIndex > -1) {
                // there is a unit
                const arrCount = arrIng.slice(0, unitIndex);

                let count;
                if(arrCount.length === 1) {
                    count = eval(arrCount[0].replace('-', '+'));
                } else {
                    count = eval(arrCount.join('+'));
                }

                ObjIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' ')
                };


            } else if(parseInt(arrIng[0], 10)) {
                // No unit just number of ing
                ObjIng = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                }
            }else if (unitIndex === -1) {
                //No unit and no number in first position
                ObjIng = {
                    count: 1,
                    unit: '',
                    ingredient
                }
            }


            return ObjIng;

        });
        this.ingredients = newIngredients;
    }

    updateServings(type) {
        // Servings
        const newServings = type === 'dec' ? this.servings - 1: this.servings + 1;

        // Ingredients
        this.ingredients.forEach(ing => {
            ing.count *= (newServings / this.servings);
        });

        this.servings = newServings;
    }
}