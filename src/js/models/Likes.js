export default class Likes {
    constructor () {
        this.likes = [];
    }
    addLike(id, title, author, img) {
        const like = { id, title, author, img };
        this.likes.push(like);

        // Persist the data into local Storage
        this.persistData();

        return like;
    }

    deleteLike (id) {
        const index = this.likes.findIndex(el => el.id === id);
        // [2,4,8] splice(1,1) -> returns 4, original array is [2,8] (mutate original array).
        // [2,4,8] splice(1,1) -> returns 4, original array is [2,4,8] (do not mutate original array).
        this.likes.splice(index, 1);

        // Persist the data into local storage 
        this.persistData();

    }

    isLiked(id) {
        return this.likes.findIndex(el => el.id === id) !== -1;
    }

    getNumLikes() {
        // console.log(this.likes.length);
        return this.likes.length;
    }

    persistData() {
        localStorage.setItem('likes', JSON.stringify(this.likes));

    }

    readStorage() {
        const storage = JSON.parse(localStorage.getItem('likes'));

        // Restoring likes from localStorage
        if(storage) this.likes = storage;
    }
}