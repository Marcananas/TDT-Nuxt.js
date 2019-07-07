export const state =()=> ({
  posts:[]  
})

export const mutations = {
    getPost(state, index){
        return state.posts[index]
    },

    addPost(state, post){
        state.posts.unshift(post);
        if(state.posts.length > 5) {
            state.posts.length = 5;
        }

        if(process.browser){
            localStorage.setItem("posts", JSON.stringify(state.posts));
        }
    }
}