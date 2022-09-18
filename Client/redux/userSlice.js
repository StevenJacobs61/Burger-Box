import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: 'user',
    initialState:{
        username:'',
        password:'',
        admin: false,
    },
    reducers:({
        addUser: (state, action) => {
            state.username = action.payload.username;
            state.password = action.payload.password;
        },
        setAdmin: (state, action) => {
            state.admin = action.payload.isAdmin;
        },
        reset: (state) => {
            state.username='',  
            state.password=''
        }
}
)});
export const {addUser, setAdmin, reset} = userSlice.actions;
export default userSlice.reducer;