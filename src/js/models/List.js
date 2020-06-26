import uniqid from 'uniqid';

export default class List {
    constructor () {
        this.items = [];
    }

    addItem (count, unit, ingredient) {
        const item = {
            id: uniqid(),
            unit,
            count,
            ingredient
        }
        this.items.push(item);
    }

    deleteItem(id) {
        const index = this.items.findIndex(el => el.id === id);
        // [2,4,8] splice(1,1) -> returns 4, original array is [2,8] (mutate original array).
        // [2,4,8] splice(1,1) -> returns 4, original array is [2,4,8] (do not mutate original array).
        this.items.splice(index, 1);
    }

    updateCount(id, newCount){
        this.items.find(el => el.id === id).count = newCount;
    }

}